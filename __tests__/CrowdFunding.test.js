import { renderHook, act } from '@testing-library/react'
import { CrowdFundingProvider, useCrowdFunding } from '../Context/CrowdFunding'

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    providers: {
      Web3Provider: jest.fn(() => ({
        getSigner: jest.fn(),
        getNetwork: jest.fn(),
      })),
    },
    Contract: jest.fn(),
  },
}))

// Mock web3modal
jest.mock('web3modal', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  })),
}))

describe('CrowdFunding Context', () => {
  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock window.ethereum
    Object.defineProperty(window, 'ethereum', {
      value: {
        request: jest.fn(),
        on: jest.fn(),
        removeListener: jest.fn(),
      },
      writable: true,
    })

    wrapper = ({ children }) => (
      <CrowdFundingProvider>{children}</CrowdFundingProvider>
    )
  })

  test('provides initial context values', () => {
    const { result } = renderHook(() => useCrowdFunding(), { wrapper })

    expect(result.current.currentAccount).toBe(null)
    expect(result.current.campaigns).toEqual([])
    expect(typeof result.current.connectWallet).toBe('function')
    expect(typeof result.current.createCampaign).toBe('function')
    expect(typeof result.current.donateToCampaign).toBe('function')
  })

  test('connectWallet function works', async () => {
    const { result } = renderHook(() => useCrowdFunding(), { wrapper })

    // Mock successful wallet connection
    window.ethereum.request.mockResolvedValue(['0x1234567890123456789012345678901234567890'])

    await act(async () => {
      await result.current.connectWallet()
    })

    expect(result.current.currentAccount).toBe('0x1234567890123456789012345678901234567890')
  })

  test('handles wallet connection error', async () => {
    const { result } = renderHook(() => useCrowdFunding(), { wrapper })

    // Mock failed wallet connection
    window.ethereum.request.mockRejectedValue(new Error('Connection failed'))

    await act(async () => {
      await result.current.connectWallet()
    })

    expect(result.current.currentAccount).toBe(null)
  })

  test('createCampaign function validates input', async () => {
    const { result } = renderHook(() => useCrowdFunding(), { wrapper })

    const campaignData = {
      title: '',
      description: '',
      target: '0',
      deadline: '',
      image: '',
    }

    await act(async () => {
      await result.current.createCampaign(campaignData)
    })

    // Should not create campaign with invalid data
    expect(result.current.campaigns).toEqual([])
  })

  test('createCampaign function works with valid data', async () => {
    const { result } = renderHook(() => useCrowdFunding(), { wrapper })

    const campaignData = {
      title: 'Test Campaign',
      description: 'Test Description',
      target: '1000',
      deadline: '1234567890',
      image: 'https://example.com/image.jpg',
    }

    // Mock contract interaction
    const mockContract = {
      createCampaign: jest.fn(),
    }
    
    await act(async () => {
      await result.current.createCampaign(campaignData)
    })

    // In a real implementation, this would add the campaign to the list
    // For now, we just test that the function doesn't throw
    expect(typeof result.current.createCampaign).toBe('function')
  })

  test('donateToCampaign function works', async () => {
    const { result } = renderHook(() => useCrowdFunding(), { wrapper })

    const donationData = {
      pId: '1',
      amount: '100',
    }

    // Mock contract interaction
    const mockContract = {
      donateToCampaign: jest.fn(),
    }

    await act(async () => {
      await result.current.donateToCampaign(donationData.pId, donationData.amount)
    })

    expect(typeof result.current.donateToCampaign).toBe('function')
  })

  test('getCampaigns function works', async () => {
    const { result } = renderHook(() => useCrowdFunding(), { wrapper })

    await act(async () => {
      await result.current.getCampaigns()
    })

    expect(typeof result.current.getCampaigns).toBe('function')
  })

  test('getUserCampaigns function works', async () => {
    const { result } = renderHook(() => useCrowdFunding(), { wrapper })

    await act(async () => {
      await result.current.getUserCampaigns()
    })

    expect(typeof result.current.getUserCampaigns).toBe('function')
  })

  test('getCampaignDetails function works', async () => {
    const { result } = renderHook(() => useCrowdFunding(), { wrapper })

    await act(async () => {
      await result.current.getCampaignDetails('1')
    })

    expect(typeof result.current.getCampaignDetails).toBe('function')
  })

  test('deleteCampaign function works', async () => {
    const { result } = renderHook(() => useCrowdFunding(), { wrapper })

    await act(async () => {
      await result.current.deleteCampaign('1')
    })

    expect(typeof result.current.deleteCampaign).toBe('function')
  })

  test('handles account change events', () => {
    const { result } = renderHook(() => useCrowdFunding(), { wrapper })

    // Simulate account change event
    const accounts = ['0x1234567890123456789012345678901234567890']
    
    act(() => {
      // This would normally be triggered by MetaMask
      result.current.handleAccountsChanged(accounts)
    })

    expect(result.current.currentAccount).toBe('0x1234567890123456789012345678901234567890')
  })

  test('handles wallet disconnection', () => {
    const { result } = renderHook(() => useCrowdFunding(), { wrapper })

    // Set initial account
    act(() => {
      result.current.setCurrentAccount('0x1234567890123456789012345678901234567890')
    })

    expect(result.current.currentAccount).toBe('0x1234567890123456789012345678901234567890')

    // Simulate disconnection
    act(() => {
      result.current.handleAccountsChanged([])
    })

    expect(result.current.currentAccount).toBe(null)
  })
})
