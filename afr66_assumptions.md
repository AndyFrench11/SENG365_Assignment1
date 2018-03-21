#Assumptions Made

##Photos
1. In the POST /auctions/{id}/photos endpoint, I am assuming that the user doesn't have a photo for the auction,
and if they do, that they have deleted it previous to doing the post.
2. In the POST /auctions/{id}/photos endpoint, I am assuming that the user inputs a valid photo for the auction,
not an empty photo.

##Auctions
1. In the POST /auctions/{id}/bids endpoint, I am assuming that a user cannot bid on their own auction and
returning a 400 if they do.
2. In the PATCH /auctions/{id} endpoint, I am assuming that the user may only update it if the auction hasn't started.
3. In the PATCH /auctions/{id} endpoint, I am assuming that you must be the owner of the auction to update its information.
