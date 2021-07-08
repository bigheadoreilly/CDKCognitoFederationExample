export default {

    awsConfig: {
        Auth: {
            // Amazon Cognito Identity Pool ID
            identityPoolId: '',
            // Amazon Cognito Region
            region: '',
            // Amazon Cognito User Pool ID
            userPoolId: 'us-east-1_p8eoT3zY9',
            // Amazon Cognito Web Client ID
            userPoolWebClientId: '',
            // Enforce user authentication prior to accessing AWS resources or not
            mandatorySignIn: true,
            // oauth

            oauth: {
                domain: '<replace>.auth.us-east-1.amazoncognito.com', // {your-cognito-domain.auth.us-east-1.amazoncognito.com}
                scope: ['profile', 'openid', 'aws.cognito.signin.user.admin'],
                redirectSignIn: `${window.location.origin}/callback`,
                redirectSignOut:
                    `${window.location.origin}/logout`,
                responseType: 'code',
            },
        },
        Analytics: {
            disabled: true,
        },
        API: {
            endpoints: [
                {
                    name: '<api-name>',
                    endpoint: '<replace-api-endpoint>',
                    region: 'us-east-1',
                    /*custom_header: async () => ({
                        jwttoken: (await Auth.currentSession()).getIdToken().getJwtToken(),
                      })*/
                },
            ],
        },
    },
};
