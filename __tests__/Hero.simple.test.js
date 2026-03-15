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

  test('renders hero section correctly', () => {
    render(<Hero createCampaign={jest.fn()} />)
    
    expect(screen.getByText('Launch campaigns on the')).toBeInTheDocument()
    expect(screen.getByText('Ethereum blockchain')).toBeInTheDocument()
    expect(screen.getByText('Launch a')).toBeInTheDocument()
    expect(screen.getByText('Campaign')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g. EcoChain: Reforestation DAO')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('What are you building? Why should people back it?')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument()
  })

  test('has create campaign button', () => {
    render(<Hero createCampaign={jest.fn()} />)
    
    const createButton = screen.getByRole('button', { name: /Launch Campaign/i })
    expect(createButton).toBeInTheDocument()
  })

  test('form inputs are empty initially', () => {
    render(<Hero createCampaign={jest.fn()} />)
    
    const titleInput = screen.getByPlaceholderText('e.g. EcoChain: Reforestation DAO')
    const descTextarea = screen.getByPlaceholderText('What are you building? Why should people back it?')
    const amountInput = screen.getByPlaceholderText('0.00')
    
    expect(titleInput).toHaveValue('')
    expect(descTextarea).toHaveValue('')
    expect(amountInput).toHaveValue('')
  })

  test('updates input values when typed', () => {
    render(<Hero createCampaign={jest.fn()} />)
    
    const titleInput = screen.getByPlaceholderText('e.g. EcoChain: Reforestation DAO')
    fireEvent.change(titleInput, { target: { value: 'Test Campaign' } })
    
    expect(titleInput).toHaveValue('Test Campaign')
  })
})
