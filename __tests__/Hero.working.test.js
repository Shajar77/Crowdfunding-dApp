import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Hero } from '../Components'

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

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
}))

describe('Hero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders hero section with key elements', () => {
    render(<Hero createCampaign={jest.fn()} />)
    
    // Check for main elements
    expect(screen.getByText('Launch a')).toBeInTheDocument()
    expect(screen.getByText('Campaign')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g. EcoChain: Reforestation DAO')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('What are you building? Why should people back it?')).toBeInTheDocument()
  })

  test('has launch campaign button', () => {
    render(<Hero createCampaign={jest.fn()} />)
    
    const createButton = screen.getByRole('button', { name: /Launch Campaign/i })
    expect(createButton).toBeInTheDocument()
  })

  test('title input can be updated', () => {
    render(<Hero createCampaign={jest.fn()} />)
    
    const titleInput = screen.getByPlaceholderText('e.g. EcoChain: Reforestation DAO')
    fireEvent.change(titleInput, { target: { value: 'Test Campaign' } })
    
    expect(titleInput).toHaveValue('Test Campaign')
  })

  test('description textarea can be updated', () => {
    render(<Hero createCampaign={jest.fn()} />)
    
    const descTextarea = screen.getByPlaceholderText('What are you building? Why should people back it?')
    fireEvent.change(descTextarea, { target: { value: 'Test Description' } })
    
    expect(descTextarea).toHaveValue('Test Description')
  })

  test('shows file upload area', () => {
    render(<Hero createCampaign={jest.fn()} />)
    
    expect(screen.getByText('Click to upload')).toBeInTheDocument()
    expect(screen.getByText('PNG, JPG — pinned to IPFS')).toBeInTheDocument()
  })

  test('displays footer features', () => {
    render(<Hero createCampaign={jest.fn()} />)
    
    expect(screen.getByText('Audited')).toBeInTheDocument()
    expect(screen.getByText('Non-custodial')).toBeInTheDocument()
    expect(screen.getByText('0% Fee')).toBeInTheDocument()
  })
})
