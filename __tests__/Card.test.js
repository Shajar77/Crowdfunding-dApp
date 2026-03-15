import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Card } from '../Components/Card'

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

describe('Card Component', () => {
  const mockCampaign = {
    id: 1,
    owner: '0x1234567890123456789012345678901234567890',
    title: 'Test Campaign',
    description: 'This is a test campaign description',
    target: '1000',
    deadline: '1234567890',
    amountCollected: '500',
    image: 'https://example.com/image.jpg',
    isHidden: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders campaign information correctly', () => {
    render(<Card campaign={mockCampaign} />)
    
    expect(screen.getByText('Test Campaign')).toBeInTheDocument()
    expect(screen.getByText('This is a test campaign description')).toBeInTheDocument()
    expect(screen.getByText('500 / 1000 ETH')).toBeInTheDocument()
  })

  test('shows donate button when user is not owner', () => {
    render(<Card campaign={mockCampaign} />)
    
    const donateButton = screen.getByRole('button', { name: /donate/i })
    expect(donateButton).toBeInTheDocument()
  })

  test('shows delete button when user is owner', () => {
    render(<Card campaign={mockCampaign} currentAccount={mockContext.currentAccount} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    expect(deleteButton).toBeInTheDocument()
  })

  test('opens donation popup when donate button is clicked', () => {
    const mockSetOpenModel = jest.fn()
    render(<Card campaign={mockCampaign} setOpenModel={mockSetOpenModel} />)
    
    const donateButton = screen.getByRole('button', { name: /donate/i })
    fireEvent.click(donateButton)
    
    expect(mockSetOpenModel).toHaveBeenCalledWith(true)
  })

  test('calculates progress percentage correctly', () => {
    render(<Card campaign={mockCampaign} />)
    
    // 500 out of 1000 = 50%
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveStyle('width: 50%')
  })

  test('displays "Expired" for past deadline', () => {
    const pastCampaign = {
      ...mockCampaign,
      deadline: (Date.now() / 1000 - 86400).toString(), // Yesterday
    }
    
    render(<Card campaign={pastCampaign} />)
    
    expect(screen.getByText('Expired')).toBeInTheDocument()
  })

  test('toggles description expansion', () => {
    const longDescription = 'A'.repeat(200)
    const longCampaign = {
      ...mockCampaign,
      description: longDescription,
    }
    
    render(<Card campaign={longCampaign} />)
    
    const description = screen.getByText(longDescription)
    expect(description).toBeInTheDocument()
    
    // Initially should not show "Show less"
    expect(screen.queryByText('Show less')).not.toBeInTheDocument()
    
    // Click to expand
    const expandButton = screen.getByText('Show more')
    fireEvent.click(expandButton)
    
    // After expanding, should show "Show less"
    expect(screen.getByText('Show less')).toBeInTheDocument()
  })
})
