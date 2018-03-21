#Assumptions Made

##Photos
1. In the POST /auctions/{id}/photos endpoint, I am assuming that the user doesn't have a photo for the auction,
and if they do, that they have deleted it previous to doing the post.
2. In the POST /auctions/{id}/photos endpoint, I am assuming that the user inputs a valid photo for the auction,
not an empty photo.
3. In the POST and DELETE /auctions/{id}/photos endpoint, I am assuming that only the owner of the auction may add a photo to the auction.
4. In the POST /auctions/{id}/photos endpoint, I am assuming that the user disables the "Content-Type" header.

##Auctions
1. In the POST /auctions/{id}/bids endpoint, I am assuming that a user cannot bid on their own auction and
returning a 400 if they do.
2. In the PATCH /auctions/{id} endpoint, I am assuming that the user may only update it if the auction hasn't started.
3. In the PATCH /auctions/{id} endpoint, I am assuming that you must be the owner of the auction to update its information.

##Users
1. In the POST /users/login endpoint, I have assumed that the password is case-insensitive.

##General
1. I have assumed that if someone puts in malformed data (ie. inproperly formed JSON) returning an error in the body is okay.
