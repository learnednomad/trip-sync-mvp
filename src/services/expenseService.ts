import { supabase } from '@/lib/supabase'
import { Expense, ExpenseSplit } from '@/types/supabase'

export class ExpenseService {
  // Expense CRUD Operations
  static async createExpense(expenseData: Partial<Expense>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Create the expense
    const { data: expense, error } = await supabase
      .from('expenses')
      .insert([{
        ...expenseData,
        paid_by: expenseData.paid_by || user.id,
      }])
      .select()
      .single()

    if (error) throw error

    // Create expense splits if it's a shared expense
    if (expense.is_shared && expenseData.split_type) {
      await this.createExpenseSplits(expense.id, expense)
    }

    return expense
  }

  static async updateExpense(expenseId: string, updates: Partial<Expense>) {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', expenseId)
      .select()
      .single()

    if (error) throw error

    // Update splits if needed
    if (updates.amount || updates.split_type) {
      await this.updateExpenseSplits(expenseId, data)
    }

    return data
  }

  static async deleteExpense(expenseId: string) {
    // Delete splits first (cascade should handle this)
    const { error: splitsError } = await supabase
      .from('expense_splits')
      .delete()
      .eq('expense_id', expenseId)

    if (splitsError) throw splitsError

    // Delete expense
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)

    if (error) throw error
  }

  static async getExpenseById(expenseId: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_splits (
          *,
          users (*)
        ),
        paid_by_user:users!paid_by (*)
      `)
      .eq('id', expenseId)
      .single()

    if (error) throw error
    return data
  }

  static async getTripExpenses(tripId: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_splits (*),
        paid_by_user:users!paid_by (*)
      `)
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getUserExpenses(userId: string, tripId?: string) {
    let query = supabase
      .from('expense_splits')
      .select(`
        *,
        expense:expenses (
          *,
          paid_by_user:users!paid_by (*)
        )
      `)
      .eq('user_id', userId)

    if (tripId) {
      query = query.eq('expense.trip_id', tripId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Expense Split Management
  static async createExpenseSplits(expenseId: string, expense: Expense) {
    // Get trip participants
    const { data: participants, error: participantsError } = await supabase
      .from('trip_participants')
      .select('user_id')
      .eq('trip_id', expense.trip_id)
      .eq('status', 'accepted')

    if (participantsError) throw participantsError

    const participantIds = participants?.map(p => p.user_id) || []
    const splits = this.calculateSplits(expense, participantIds)

    const { error } = await supabase
      .from('expense_splits')
      .insert(splits)

    if (error) throw error
  }

  static async updateExpenseSplits(expenseId: string, expense: Expense) {
    // Delete existing splits
    const { error: deleteError } = await supabase
      .from('expense_splits')
      .delete()
      .eq('expense_id', expenseId)

    if (deleteError) throw deleteError

    // Create new splits
    await this.createExpenseSplits(expenseId, expense)
  }

  private static calculateSplits(
    expense: Expense,
    participantIds: string[]
  ): Partial<ExpenseSplit>[] {
    const splits: Partial<ExpenseSplit>[] = []

    switch (expense.split_type) {
      case 'equal': {
        const amountPerPerson = expense.amount / participantIds.length
        participantIds.forEach(userId => {
          splits.push({
            expense_id: expense.id,
            user_id: userId,
            amount: amountPerPerson,
            is_paid: userId === expense.paid_by,
            paid_at: userId === expense.paid_by ? new Date().toISOString() : null,
          })
        })
        break
      }
      case 'percentage':
      case 'amount':
      case 'custom':
        // These would need additional data from the UI
        // For MVP, default to equal split
        const defaultAmount = expense.amount / participantIds.length
        participantIds.forEach(userId => {
          splits.push({
            expense_id: expense.id,
            user_id: userId,
            amount: defaultAmount,
            is_paid: userId === expense.paid_by,
            paid_at: userId === expense.paid_by ? new Date().toISOString() : null,
          })
        })
        break
    }

    return splits
  }

  // Settlement and Balance Calculations
  static async calculateBalances(tripId: string) {
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_splits (*)
      `)
      .eq('trip_id', tripId)

    if (error) throw error

    const balances: Record<string, number> = {}
    const owes: Record<string, Record<string, number>> = {}

    expenses?.forEach(expense => {
      // Track who paid
      if (!balances[expense.paid_by]) {
        balances[expense.paid_by] = 0
      }
      balances[expense.paid_by] += expense.amount

      // Track who owes
      expense.expense_splits?.forEach(split => {
        if (!balances[split.user_id]) {
          balances[split.user_id] = 0
        }
        balances[split.user_id] -= split.amount

        // Track detailed owes
        if (split.user_id !== expense.paid_by && !split.is_paid) {
          if (!owes[split.user_id]) {
            owes[split.user_id] = {}
          }
          if (!owes[split.user_id][expense.paid_by]) {
            owes[split.user_id][expense.paid_by] = 0
          }
          owes[split.user_id][expense.paid_by] += split.amount
        }
      })
    })

    return { balances, owes }
  }

  static async settleExpense(expenseId: string, userId: string) {
    const { data, error } = await supabase
      .from('expense_splits')
      .update({
        is_paid: true,
        paid_at: new Date().toISOString(),
      })
      .match({
        expense_id: expenseId,
        user_id: userId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUnsettledExpenses(tripId: string, userId: string) {
    const { data, error } = await supabase
      .from('expense_splits')
      .select(`
        *,
        expense:expenses!inner (
          *,
          paid_by_user:users!paid_by (*)
        )
      `)
      .eq('expense.trip_id', tripId)
      .eq('user_id', userId)
      .eq('is_paid', false)
      .neq('expense.paid_by', userId)

    if (error) throw error
    return data || []
  }

  // Receipt Management
  static async uploadReceipt(expenseId: string, file: File | Blob) {
    const fileExt = 'jpg' // You might want to detect this from the file
    const fileName = `${expenseId}-${Date.now()}.${fileExt}`
    const filePath = `receipts/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('expense-receipts')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('expense-receipts')
      .getPublicUrl(filePath)

    // Update expense with receipt URL
    const { data, error } = await supabase
      .from('expenses')
      .update({ receipt_url: publicUrl })
      .eq('id', expenseId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteReceipt(expenseId: string, receiptUrl: string) {
    // Extract file path from URL
    const urlParts = receiptUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `receipts/${fileName}`

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('expense-receipts')
      .remove([filePath])

    if (deleteError) throw deleteError

    // Update expense
    const { data, error } = await supabase
      .from('expenses')
      .update({ receipt_url: null })
      .eq('id', expenseId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Analytics
  static async getExpenseStats(tripId: string) {
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('amount, category, currency')
      .eq('trip_id', tripId)

    if (error) throw error

    const stats = {
      total: 0,
      byCategory: {} as Record<string, number>,
      count: expenses?.length || 0,
      average: 0,
    }

    expenses?.forEach(expense => {
      stats.total += expense.amount
      if (!stats.byCategory[expense.category]) {
        stats.byCategory[expense.category] = 0
      }
      stats.byCategory[expense.category] += expense.amount
    })

    stats.average = stats.count > 0 ? stats.total / stats.count : 0

    return stats
  }
}