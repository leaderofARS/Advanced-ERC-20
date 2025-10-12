// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.10;

contract Twitter is Ownable(msg.sender) {
    
    uint16 public MAX_TWEET_LENGTH = 300;

    struct Tweet{
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
    }

    mapping (address => Tweet[]) public tweets;



    event TweetCreated(uint256 id, address author, string content, uint256 timestamp);

    event TweetLiked(address liker, address tweetAuthor, uint256 tweetId, uint256 tweetLikeCount );

    event TweetUnliked(address unliker, address tweetAuthor, uint256 tweetId, uint256 newLikeCount);

    function createTweet(string memory _tweet) public  {

    require(bytes(_tweet).length <= MAX_TWEET_LENGTH, "Tweet Execced the max length");

    Tweet memory newTweet = Tweet({
        id: tweets[msg.sender].length,
        author: msg.sender,
        content: _tweet,
        timestamp: block.timestamp,
        likes: 0 
    });

        tweets[msg.sender].push(newTweet);

    emit TweetCreated(newTweet.id, newTweet.author, newTweet.content, newTweet.timestamp);

    }

    function likeTweet(address author, uint256 id) external {
        require(tweets[author][id].id == id, "Tweet Does Not Exist");

        tweets[author][id].likes++;

        emit TweetLiked(msg.sender, author, id, tweets[author][id].likes);

    }

    function unlikeTweet(address author, uint256 id) external {
        require(tweets[author][id].id == id, "Tweet Does not exist");
        require(tweets[author][id].id > 0, "Twwet does not have Likes");
        tweets[author][id].id--;

        emit TweetUnliked(msg.sender, author, id, tweets[author][id].likes);
        
    }


    function changeTweetLength(uint16 newTweetLength) public onlyOwner {
        MAX_TWEET_LENGTH = newTweetLength;
    }

    function getTotalLikes(address _author) external view returns(uint){
        uint totalLikes = 0;

        for(uint i=0; i < tweets[_author].length; i++){
            totalLikes += tweets[_author][i].likes;
        }
        return totalLikes;
    }

    function getTweet(uint _i) public view returns (Tweet memory){
        return tweets[msg.sender][_i];

    }

    function getAllTweets(address _owner) public view returns (Tweet[] memory){
        return tweets[_owner];
    }
}
