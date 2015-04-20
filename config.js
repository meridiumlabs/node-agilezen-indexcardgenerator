module.exports = {
    projectId : <int>-replace-with-project-id,
    API : {
        requestOptions : {
            encoding: 'utf8',
            method : 'GET',
            headers : {
                accept : 'application/json',
                'X-Zen-ApiKey' : 'replace-with-own-API-key-here'
            }
        }
    }
}