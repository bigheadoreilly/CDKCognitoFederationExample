import * as cdk from '@aws-cdk/core';

interface appSyncStackProps extends cdk.StackProps {
    identityPoolRef: string;
}

export class LeastPrivilegeAppSyncStack extends cdk.Stack {

    constructor(scope: cdk.Construct, id: string, props?: appSyncStackProps) {
        super(scope, id, props);
    }

    //TODO Plaecholder for the AppSync example.

}