// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        string image; // ✅ added
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
        bool isHidden; 
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        string memory _image, // ✅ added
        uint256 _target,
        uint256 _deadline
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.image = _image; // ✅ added
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.isHidden = false; 

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");
        if (sent) {
            campaign.amountCollected += amount;
        }
    }

    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function toggleHidden(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Only owner can toggle visibility");
        campaign.isHidden = !campaign.isHidden;
    }

    function getCampaigns() public view returns (
        address[] memory owners,
        string[] memory titles,
        string[] memory descriptions,
        string[] memory images, // ✅ added
        uint[] memory targets,
        uint[] memory deadlines,
        uint[] memory amountsCollected,
        bool[] memory isHiddens
    ) {
        owners = new address[](numberOfCampaigns);
        titles = new string[](numberOfCampaigns);
        descriptions = new string[](numberOfCampaigns);
        images = new string[](numberOfCampaigns); // ✅ added
        targets = new uint[](numberOfCampaigns);
        deadlines = new uint[](numberOfCampaigns);
        amountsCollected = new uint[](numberOfCampaigns);
        isHiddens = new bool[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            owners[i] = campaign.owner;
            titles[i] = campaign.title;
            descriptions[i] = campaign.description;
            images[i] = campaign.image; // ✅ added
            targets[i] = campaign.target;
            deadlines[i] = campaign.deadline;
            amountsCollected[i] = campaign.amountCollected;
            isHiddens[i] = campaign.isHidden;
        }

        return (owners, titles, descriptions, images, targets, deadlines, amountsCollected, isHiddens); 
    }
}
