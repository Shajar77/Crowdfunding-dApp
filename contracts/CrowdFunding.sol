// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title CrowdFunding
 * @dev Optimized crowdfunding contract for handling multiple campaigns.
 */
contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        string image;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
        bool isHidden;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    // Events for better off-chain tracking
    event CampaignCreated(uint256 indexed id, address indexed owner, string title, uint256 target, uint256 deadline);
    event DonationReceived(uint256 indexed id, address indexed donator, uint256 amount);
    event VisibilityToggled(uint256 indexed id, bool isHidden);

    /**
     * @dev Creates a new crowdfunding campaign.
     * @param _owner Address of the campaign creator.
     * @param _title Title of the campaign.
     * @param _description Description of the campaign.
     * @param _image URL/IPFS hash of the campaign image.
     * @param _target Goal amount in wei.
     * @param _deadline Unix timestamp for the deadline.
     */
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        string memory _image,
        uint256 _target,
        uint256 _deadline
    ) external returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.image = _image;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.isHidden = false;

        uint256 currentId = numberOfCampaigns;
        numberOfCampaigns++;

        emit CampaignCreated(currentId, _owner, _title, _target, _deadline);
        return currentId;
    }

    /**
     * @dev Donates funds to a specific campaign and transfers them immediately to the owner.
     * @param _id Campaign ID.
     */
    function donateToCampaign(uint256 _id) external payable {
        uint256 amount = msg.value;
        require(amount > 0, "Donation must be greater than 0");
        
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp < campaign.deadline, "Campaign has ended");

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");
        require(sent, "Failed to send Ether to campaign owner");

        campaign.amountCollected += amount;
        emit DonationReceived(_id, msg.sender, amount);
    }

    /**
     * @dev Toggles campaign visibility.
     * @param _id Campaign ID.
     */
    function toggleHidden(uint256 _id) external {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Only owner can toggle visibility");
        
        campaign.isHidden = !campaign.isHidden;
        emit VisibilityToggled(_id, campaign.isHidden);
    }

    /**
     * @dev Fetches all campaigns.
     */
    function getCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    /**
     * @dev Fetches donators and their respective donation amounts for a campaign.
     */
    function getDonators(uint256 _id) external view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }
}
