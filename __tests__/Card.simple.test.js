import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from '../Components'

// Mock the CrowdFundingContext
jest.mock('../Context/CrowdFunding', () => ({
  CrowdFundingContext: {
    _currentValue: {
      currentAccount: '0x1234567890123456789012345678901234567890',
      connectWallet: jest.fn(),
      createCampaign: jest.fn(),
      donateToCampaign: jest.fn(),
      getCampaigns: jest.fn(),
      getUserCampaigns: jest.fn(),
      getCampaignDetails: jest.fn(),
      deleteCampaign: jest.fn(),
    },
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
    render(<Card campaign={mockCampaign} setOpenModel={jest.fn()} setDonate={jest.fn()} />)
    
    expect(screen.getByText('Test Campaign')).toBeInTheDocument()
    expect(screen.getByText('This is a test campaign description')).toBeInTheDocument()
  })

  test('shows donate button when user is not owner', () => {
    render(<Card campaign={mockCampaign} setOpenModel={jest.fn()} setDonate={jest.fn()} />)
    
    const donateButton = screen.getByRole('button', { name: /back this project/i })
    expect(donateButton).toBeInTheDocument()
  })

  test('opens donation popup when donate button is clicked', () => {
    const mockSetOpenModel = jest.fn()
    const mockSetDonate = jest.fn()
    render(<Card campaign={mockCampaign} setOpenModel={mockSetOpenModel} setDonate={mockSetDonate} />)
    
    const donateButton = screen.getByRole('button', { name: /back this project/i })
    fireEvent.click(donateButton)
    
    expect(mockSetOpenModel).toHaveBeenCalledWith(true)
    expect(mockSetDonate).toHaveBeenCalledWith(mockCampaign)
  })
})
