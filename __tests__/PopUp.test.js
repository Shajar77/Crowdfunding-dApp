import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PopUp } from '../Components/PopUp'

// Mock the CrowdFundingContext
const mockContext = {
  currentAccount: '0x1234567890123456789012345678901234567890',
  connectWallet: jest.fn(),
  createCampaign: jest.fn(),
  donateToCampaign: jest.fn(),
  getCampaigns: jest.fn(),
  getUserCampaigns: jest.fn(),
  getCampaignDetails: jest.fn(),
  deleteCampaign: jest.fn(),
}

jest.mock('../Context/CrowdFunding', () => ({
  CrowdFundingContext: {
    _currentValue: mockContext,
  },
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}))

describe('PopUp Component', () => {
  const mockCampaign = {
    id: 1,
    owner: '0x1234567890123456789012345678901234567890',
    title: 'Test Campaign',
    description: 'This is a test campaign',
    target: '1000',
    deadline: '1234567890',
    amountCollected: '500',
    image: 'https://example.com/image.jpg',
    isHidden: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders popup when open', () => {
    render(
      <PopUp
        open={true}
        setOpenModel={jest.fn()}
        donate={mockCampaign}
        setDonate={jest.fn()}
      />
    )

    expect(screen.getByText('Back This Project')).toBeInTheDocument()
    expect(screen.getByText('Test Campaign')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Amount (ETH)')).toBeInTheDocument()
  })

  test('does not render when closed', () => {
    render(
      <PopUp
        open={false}
        setOpenModel={jest.fn()}
        donate={mockCampaign}
        setDonate={jest.fn()}
      />
    )

    expect(screen.queryByText('Back This Project')).not.toBeInTheDocument()
  })

  test('closes popup when close button is clicked', () => {
    const mockSetOpenModel = jest.fn()
    render(
      <PopUp
        open={true}
        setOpenModel={mockSetOpenModel}
        donate={mockCampaign}
        setDonate={jest.fn()}
      />
    )

    const closeButton = screen.getByRole('button', { name: '×' })
    fireEvent.click(closeButton)

    expect(mockSetOpenModel).toHaveBeenCalledWith(false)
  })

  test('closes popup when backdrop is clicked', () => {
    const mockSetOpenModel = jest.fn()
    render(
      <PopUp
        open={true}
        setOpenModel={mockSetOpenModel}
        donate={mockCampaign}
        setDonate={jest.fn()}
      />
    )

    const backdrop = screen.getByTestId('popup-backdrop')
    fireEvent.click(backdrop)

    expect(mockSetOpenModel).toHaveBeenCalledWith(false)
  })

  test('submits donation with valid amount', async () => {
    const mockDonateToCampaign = mockContext.donateToCampaign
    mockDonateToCampaign.mockResolvedValue(true)
    const mockSetOpenModel = jest.fn()
    const mockSetDonate = jest.fn()

    render(
      <PopUp
        open={true}
        setOpenModel={mockSetOpenModel}
        donate={mockCampaign}
        setDonate={mockSetDonate}
      />
    )

    // Enter donation amount
    const amountInput = screen.getByPlaceholderText('Amount (ETH)')
    fireEvent.change(amountInput, { target: { value: '0.5' } })

    // Submit donation
    const donateButton = screen.getByRole('button', { name: /Donate/i })
    fireEvent.click(donateButton)

    await waitFor(() => {
      expect(mockDonateToCampaign).toHaveBeenCalledWith(mockCampaign.id, '0.5')
    })

    expect(mockSetOpenModel).toHaveBeenCalledWith(false)
    expect(mockSetDonate).toHaveBeenCalledWith({})
  })

  test('shows validation error for empty amount', async () => {
    render(
      <PopUp
        open={true}
        setOpenModel={jest.fn()}
        donate={mockCampaign}
        setDonate={jest.fn()}
      />
    )

    // Try to donate without entering amount
    const donateButton = screen.getByRole('button', { name: /Donate/i })
    fireEvent.click(donateButton)

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid amount/)).toBeInTheDocument()
    })
  })

  test('shows validation error for negative amount', async () => {
    render(
      <PopUp
        open={true}
        setOpenModel={jest.fn()}
        donate={mockCampaign}
        setDonate={jest.fn()}
      />
    )

    // Enter negative amount
    const amountInput = screen.getByPlaceholderText('Amount (ETH)')
    fireEvent.change(amountInput, { target: { value: '-1' } })

    // Submit donation
    const donateButton = screen.getByRole('button', { name: /Donate/i })
    fireEvent.click(donateButton)

    await waitFor(() => {
      expect(screen.getByText(/Amount must be greater than 0/)).toBeInTheDocument()
    })
  })

  test('shows validation error for zero amount', async () => {
    render(
      <PopUp
        open={true}
        setOpenModel={jest.fn()}
        donate={mockCampaign}
        setDonate={jest.fn()}
      />
    )

    // Enter zero amount
    const amountInput = screen.getByPlaceholderText('Amount (ETH)')
    fireEvent.change(amountInput, { target: { value: '0' } })

    // Submit donation
    const donateButton = screen.getByRole('button', { name: /Donate/i })
    fireEvent.click(donateButton)

    await waitFor(() => {
      expect(screen.getByText(/Amount must be greater than 0/)).toBeInTheDocument()
    })
  })

  test('shows loading state while processing donation', async () => {
    const mockDonateToCampaign = mockContext.donateToCampaign
    mockDonateToCampaign.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(
      <PopUp
        open={true}
        setOpenModel={jest.fn()}
        donate={mockCampaign}
        setDonate={jest.fn()}
      />
    )

    // Enter donation amount
    const amountInput = screen.getByPlaceholderText('Amount (ETH)')
    fireEvent.change(amountInput, { target: { value: '0.5' } })

    // Submit donation
    const donateButton = screen.getByRole('button', { name: /Donate/i })
    fireEvent.click(donateButton)

    // Should show loading state
    expect(screen.getByText('Processing...')).toBeInTheDocument()
    expect(donateButton).toBeDisabled()
  })

  test('shows error message on failed donation', async () => {
    const mockDonateToCampaign = mockContext.donateToCampaign
    mockDonateToCampaign.mockRejectedValue(new Error('Transaction failed'))

    render(
      <PopUp
        open={true}
        setOpenModel={jest.fn()}
        donate={mockCampaign}
        setDonate={jest.fn()}
      />
    )

    // Enter donation amount
    const amountInput = screen.getByPlaceholderText('Amount (ETH)')
    fireEvent.change(amountInput, { target: { value: '0.5' } })

    // Submit donation
    const donateButton = screen.getByRole('button', { name: /Donate/i })
    fireEvent.click(donateButton)

    await waitFor(() => {
      expect(screen.getByText(/Failed to process donation/)).toBeInTheDocument()
    })
  })

  test('displays campaign information correctly', () => {
    render(
      <PopUp
        open={true}
        setOpenModel={jest.fn()}
        donate={mockCampaign}
        setDonate={jest.fn()}
      />
    )

    expect(screen.getByText('Test Campaign')).toBeInTheDocument()
    expect(screen.getByText('This is a test campaign')).toBeInTheDocument()
    expect(screen.getByText(/500 \/ 1000 ETH/)).toBeInTheDocument()
  })

  test('prevents submission when wallet is not connected', () => {
    mockContext.currentAccount = null

    render(
      <PopUp
        open={true}
        setOpenModel={jest.fn()}
        donate={mockCampaign}
        setDonate={jest.fn()}
      />
    )

    const donateButton = screen.getByRole('button', { name: /Donate/i })
    expect(donateButton).toBeDisabled()
    expect(screen.getByText(/Please connect your wallet/)).toBeInTheDocument()
  })

  test('formats campaign progress correctly', () => {
    const progressCampaign = {
      ...mockCampaign,
      amountCollected: '750',
      target: '1000',
    }

    render(
      <PopUp
        open={true}
        setOpenModel={jest.fn()}
        donate={progressCampaign}
        setDonate={jest.fn()}
      />
    )

    expect(screen.getByText('75%')).toBeInTheDocument()
  })
})
