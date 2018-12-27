class TwitterHandler {
    constructor (twitterMgr, claimMgr){
        this.twitterMgr = twitterMgr
        this.claimMgr = claimMgr
    }

    async handle(event, context, cb){
        let body
        try {
            body = JSON.parse(event.body)
        } catch (e) {
            cb({ code: 400, message: 'no json body: ' + e.toString() })
            return
        }

        if (event.headers.Origin != "Origin: https://3box.io") {
            cb({ code: 401, message: 'unauthorized'})
        }

        if (!body.did) {
            cb({ code: 403, message: 'no did' })
            return
        }
        if (!body.twitter_handle) {
            cb({ code: 400, message: 'no twitter handle' })
            return
        }

        let verification_url = this.twitterMgr.findDidInTweets(body.twitter_handle, body.did)

        if ( !verification_url ) {
            cb({ code: 400, message: 'no valid proof available' })
            return
        }

        let verification_claim = this.claimMgr.issue(body.did, body.twitter_handle, verification_url)

        cb(null, {verification: verification_claim})
    }
}
module.exports = TwitterHandler