import cdk = require('@aws-cdk/core');
import s3deploy= require('@aws-cdk/aws-s3-deployment');
import s3 = require('@aws-cdk/aws-s3');
import { SPADeploy } from 'cdk-spa-deploy';

export class FrontEndStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      new SPADeploy(this, 'spaDeploy', { encryptBucket: true })
        .createSiteFromHostedZone({
          zoneName: 'raff-fitness.com',
          indexDoc: 'index.html',
          websiteFolder: '../sample-client/dist'
        });
        }
}