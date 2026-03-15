import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Hero } from '../Components/Hero'

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

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
}))

// Mock canvas-confetti
jest.mock('canvas-confetti', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('Hero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders hero section correctly', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Create Your/)).toBeInTheDocument()
    expect(screen.getByText(/Crowdfunding Campaign/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Campaign Title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Campaign Description')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Target Amount (ETH)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Campaign Deadline')).toBeInTheDocument()
  })

  test('submits form with valid data', async () => {
    const mockCreateCampaign = mockContext.createCampaign
    mockCreateCampaign.mockResolvedValue(true)
    
    render(<Hero />)
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Campaign Title'), {
      target: { value: 'Test Campaign' },
    })
    fireEvent.change(screen.getByPlaceholderText('Campaign Description'), {
      target: { value: 'Test Description' },
    })
    fireEvent.change(screen.getByPlaceholderText('Target Amount (ETH)'), {
      target: { value: '1.5' },
    })
    fireEvent.change(screen.getByPlaceholderText('Campaign Deadline'), {
      target: { value: '2024-12-31' },
    })
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Campaign/i }))
    
    await waitFor(() => {
      expect(mockCreateCampaign).toHaveBeenCalledWith({
        title: 'Test Campaign',
        description: 'Test Description',
        target: '1.5',
        deadline: '2024-12-31',
        image: '',
      })
    })
  })

  test('shows validation errors for empty fields', async () => {
    render(<Hero />)
    
    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /Create Campaign/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Campaign title is required/)).toBeInTheDocument()
      expect(screen.getByText(/Campaign description is required/)).toBeInTheDocument()
      expect(screen.getByText(/Target amount is required/)).toBeInTheDocument()
      expect(screen.getByText(/Deadline is required/)).toBeInTheDocument()
    })
  })

  test('validates target amount is positive', async () => {
    render(<Hero />)
    
    // Fill form with negative target
    fireEvent.change(screen.getByPlaceholderText('Campaign Title'), {
      target: { value: 'Test Campaign' },
    })
    fireEvent.change(screen.getByPlaceholderText('Campaign Description'), {
      target: { value: 'Test Description' },
    })
    fireEvent.change(screen.getByPlaceholderText('Target Amount (ETH)'), {
      target: { value: '-1' },
    })
    fireEvent.change(screen.getByPlaceholderText('Campaign Deadline'), {
      target: { value: '2024-12-31' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /Create Campaign/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Target amount must be greater than 0/)).toBeInTheDocument()
    })
  })

  test('validates deadline is in the future', async () => {
    render(<Hero />)
    
    // Fill form with past date
    fireEvent.change(screen.getByPlaceholderText('Campaign Title'), {
      target: { value: 'Test Campaign' },
    })
    fireEvent.change(screen.getByPlaceholderText('Campaign Description'), {
      target: { value: 'Test Description' },
    })
    fireEvent.change(screen.getByPlaceholderText('Target Amount (ETH)'), {
      target: { value: '1' },
    })
    fireEvent.change(screen.getByPlaceholderText('Campaign Deadline'), {
      target: { value: '2020-01-01' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /Create Campaign/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Deadline must be in the future/)).toBeInTheDocument()
    })
  })

  test('shows loading state while submitting', async () => {
    const mockCreateCampaign = mockContext.createCampaign
    mockCreateCampaign.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<Hero />)
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText('Campaign Title'), {
      target: { value: 'Test Campaign' },
    })
    fireEvent.change(screen.getByPlaceholderText('Campaign Description'), {
      target: { value: 'Test Description' },
    })
    fireEvent.change(screen.getByPlaceholderText('Target Amount (ETH)'), {
      target: { value: '1' },
    })
    fireEvent.change(screen.getByPlaceholderText('Campaign Deadline'), {
      target: { value: '2024-12-31' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /Create Campaign/i }))
    
    // Should show loading state
    expect(screen.getByText('Creating...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('shows success message on successful campaign creation', async () => {
    const mockCreateCampaign = mockContext.createCampaign
    mockCreateCampaign.mockResolvedValue(true)
    
    render(<Hero />)
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText('Campaign Title'), {
      target: { value: 'Test Campaign' },
    })
    fireEvent.change(screen.getByPlaceholderText('Campaign Description'), {
      target: { value: 'Test Description' },
    })
    fireEvent.change(screen.getByPlaceholderText('Target Amount (ETH)'), {
      target: { value: '1' },
    })
    fireEvent.change(screen.getByPlaceholderText('Campaign Deadline'), {
      target: { value: '2024-12-31' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /Create Campaign/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Campaign created successfully!/)).toBeInTheDocument()
    })
  })

  test('shows error message on failed campaign creation', async () => {
    const mockCreateCampaign = mockContext.createCampaign
    mockCreateCampaign.mockRejectedValue(new Error('Creation failed'))
    
    render(<Hero />)
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText('Campaign Title'), {
      target: { value: 'Test Campaign' },
    })
    fireEvent.change(screen.getByPlaceholderText('Campaign Description'), {
      target: { value: 'Test Description' },
    })
    fireEvent.change(screen.getByPlaceholderText('Target Amount (ETH)'), {
      target: { value: '1' },
    })
    fireEvent.change(screen.getByPlaceholderText('Campaign Deadline'), {
      target: { value: '2024-12-31' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /Create Campaign/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to create campaign/)).toBeInTheDocument()
    })
  })
})
