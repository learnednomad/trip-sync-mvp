import { renderHook, waitFor } from '@testing-library/react-native'
import { useAuthStore } from '../authStore'
import { supabase } from '@/lib/supabase'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}))

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn().mockReturnValue(null),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}))

describe('Auth Store', () => {
  beforeEach(() => {
    // Clear store state
    useAuthStore.setState({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore())
      
      expect(result.current.user).toBeNull()
      expect(result.current.session).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('Actions', () => {
    it('should set user correctly', async () => {
      const { result } = renderHook(() => useAuthStore())
      const mockUser = { id: '123', email: 'test@example.com' } as any
      
      result.current.setUser(mockUser)
      
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser)
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.error).toBeNull()
      })
    })

    it('should set session correctly', async () => {
      const { result } = renderHook(() => useAuthStore())
      const mockSession = { 
        user: { id: '123', email: 'test@example.com' },
        access_token: 'token123'
      } as any
      
      result.current.setSession(mockSession)
      
      await waitFor(() => {
        expect(result.current.session).toEqual(mockSession)
        expect(result.current.user).toEqual(mockSession.user)
        expect(result.current.isAuthenticated).toBe(true)
      })
    })

    it('should clear user and session', async () => {
      const { result } = renderHook(() => useAuthStore())
      const mockUser = { id: '123', email: 'test@example.com' } as any
      const mockSession = { user: mockUser, access_token: 'token123' } as any
      
      // Set initial state
      result.current.setSession(mockSession)
      
      // Wait for state to be set
      await waitFor(() => {
        expect(result.current.session).toEqual(mockSession)
      })
      
      // Clear user
      result.current.clearUser()
      
      await waitFor(() => {
        expect(result.current.user).toBeNull()
        expect(result.current.session).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.error).toBeNull()
      })
    })

    it('should handle login successfully', async () => {
      const { result } = renderHook(() => useAuthStore())
      const mockData = {
        user: { id: '123', email: 'test@example.com' },
        session: { access_token: 'token123' }
      };
      
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
        data: mockData,
        error: null
      })
      
      await result.current.login('test@example.com', 'password123')
      
      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        })
        expect(result.current.user).toEqual(mockData.user)
        expect(result.current.session).toEqual(mockData.session)
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.error).toBeNull()
      })
    })

    it('should handle login error', async () => {
      const { result } = renderHook(() => useAuthStore())
      const mockError = new Error('Invalid credentials');
      
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: mockError
      })
      
      try {
        await result.current.login('test@example.com', 'wrongpassword')
      } catch (error) {
        // Expected to throw
      }
      
      await waitFor(() => {
        expect(result.current.user).toBeNull()
        expect(result.current.session).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.error).toBe('Invalid credentials')
        expect(result.current.isLoading).toBe(false)
      })
    })

    it.skip('should handle logout successfully', async () => {
      const { result } = renderHook(() => useAuthStore())
      
      // Mock supabase signOut
      (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
        error: null
      })
      
      await result.current.logout()
      
      await waitFor(() => {
        expect(supabase.auth.signOut).toHaveBeenCalled()
        expect(result.current.user).toBeNull()
        expect(result.current.session).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.error).toBeNull()
      })
    })

    it('should handle logout error', async () => {
      const { result } = renderHook(() => useAuthStore())
      const mockError = new Error('Logout failed');
      
      (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
        error: mockError
      })
      
      try {
        await result.current.logout()
      } catch (error) {
        // Expected to throw
      }
      
      await waitFor(() => {
        expect(result.current.error).toBe('Logout failed')
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should set loading state correctly', async () => {
      const { result } = renderHook(() => useAuthStore())
      
      result.current.setLoading(true)
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true)
      })
      
      result.current.setLoading(false)
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should set error state correctly', async () => {
      const { result } = renderHook(() => useAuthStore())
      
      result.current.setError('Test error')
      
      await waitFor(() => {
        expect(result.current.error).toBe('Test error')
      })
      
      result.current.setError(null)
      
      await waitFor(() => {
        expect(result.current.error).toBeNull()
      })
    })
  })
})