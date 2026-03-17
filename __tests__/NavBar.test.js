import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import NavBar from '../Components/NavBar'

// Mock the CrowdFundingContext
const mockContext = {
  currentAccount: null,
  connectWallet: jest.fn(),
  createCampaign: jest.fn(),
  donateToCampaign: jest.fn(),
  getCampaigns: jest.fn(),
  getUserCampaigns: jest.fn(),
  getCampaignDetails: jest.fn(),
  deleteCampaign: jest.fn(),
}

const MockProvider = ({ children, value = mockContext }) => (
  <mockContext.CrowdFundingContext.Provider value={value}>
    {children}
  </mockContext.CrowdFundingContext.Provider>
)

jest.mock('../Context/CrowdFunding', () => ({
  CrowdFundingContext: {
    Provider: ({ children, value }) => children,
    _currentValue: mockContext,
  },
}))

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

describe('NavBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders navigation links correctly', () => {
    render(<NavBar />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('White Paper')).toBeInTheDocument()
    expect(screen.getByText('Project')).toBeInTheDocument()
    expect(screen.getByText('Campaigns')).toBeInTheDocument()
  })

  test('shows connect wallet button when not connected', () => {
    render(<NavBar />)
    
    const connectButton = screen.getByRole('button', { name: /Connect Wallet/i })
    expect(connectButton).toBeInTheDocument()
  })

  test('shows wallet address when connected', () => {
    mockContext.currentAccount = '0x1234567890123456789012345678901234567890'
    
    render(<NavBar />)
    
    expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
    expect(screen.queryByText('Connect Wallet')).not.toBeInTheDocument()
  })

  test('opens mobile menu when menu button is clicked', () => {
    render(<NavBar />)
    
    // Find and click mobile menu button
    const menuButton = screen.getByRole('button', { name: '' }) // Hamburger menu
    fireEvent.click(menuButton)
    
    // Mobile menu should be visible
    expect(screen.getByText('White Paper')).toBeInTheDocument()
    expect(screen.getByText('Project')).toBeInTheDocument()
  })

  test('closes mobile menu when link is clicked', () => {
    render(<NavBar />)
    
    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: '' })
    fireEvent.click(menuButton)
    
    // Click a link
    const whitePaperLink = screen.getByText('White Paper')
    fireEvent.click(whitePaperLink)
    
    // Menu should close
    expect(screen.queryByText('White Paper')).not.toBeInTheDocument()
  })

  test('calls connectWallet when connect button is clicked', () => {
    render(<NavBar />)
    
    const connectButton = screen.getByRole('button', { name: /Connect Wallet/i })
    fireEvent.click(connectButton)
    
    expect(mockContext.connectWallet).toHaveBeenCalled()
  })

  test('changes style when scrolled', () => {
    render(<NavBar />)
    
    const nav = screen.getByRole('navigation')
    
    // Initially should have top class
    expect(nav).toHaveClass('top')
    
    // Simulate scroll
    fireEvent.scroll(window, { target: { scrollY: 100 } })
    
    // Should have scrolled class
    expect(nav).toHaveClass('scrolled')
  })

  test('renders logo correctly', () => {
    render(<NavBar />)
    
    const logo = screen.getByAltText('Fundverse Logo')
    expect(logo).toBeInTheDocument()
  })

  test('navigation links have correct href attributes', () => {
    render(<NavBar />)
    
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/')
    expect(screen.getByText('White Paper').closest('a')).toHaveAttribute('href', '/whitepaper')
    expect(screen.getByText('Project').closest('a')).toHaveAttribute('href', '/project')
    expect(screen.getByText('Campaigns').closest('a')).toHaveAttribute('href', '/donation')
  })

  test('shows wallet address with correct formatting', () => {
    mockContext.currentAccount = '0x1234567890123456789012345678901234567890'
    
    render(<NavBar />)
    
    // Should show shortened address
    expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
  })

  test('handles scroll events correctly', () => {
    render(<NavBar />)
    
    const nav = screen.getByRole('navigation')
    
    // Test scroll down
    fireEvent.scroll(window, { target: { scrollY: 50 } })
    expect(nav).toHaveClass('scrolled')
    
    // Test scroll to top
    fireEvent.scroll(window, { target: { scrollY: 0 } })
    expect(nav).toHaveClass('top')
  })
})
