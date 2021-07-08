<template>
  <!-- It would be neat to alternate the content of this blog based on the user jwt roles attr -->
  <div class="hello">
    <h1>Customer UI - Driven by GraphQL</h1>
    <p>User Logged in: {{ userName }}</p>
    <h3>Add a Customer</h3>
    <p>
      <label>Customer Name</label><br />
      <input
        type="text"
        id="name"
        class="form-control"
        v-model="formData.customer.name"
      />
    </p>
    <p>
      <button @click="addCustomer">Add Customer</button>
    </p>

    <h3>Current Customer List</h3>
    <p v-if="customerAddStatus != ''">{{ customerAddStatus }}</p>
    <table align="center" border="2px">
      <tr>
        <td><b>Customer Name</b></td>
      </tr>
      <tr v-for="customer in customers" :key="customer.id">
        <td align="left">{{ customer.name }}</td>
      </tr>
    </table>
    <div><button @click="signOut">Sign Out of Session</button></div>
  </div>
</template>

<script>
import API from "@aws-amplify/api";
import Auth from "@aws-amplify/auth";
import * as mutations from './graphql/mutations';
import * as queries from './graphql/queries';

export default {
  name: "CustomerUI",
  data() {
    return {
      apiName: "customerAPI",
      userName: "",
      customerAddStatus: "",
      customers: [],
      formData: {
        customer: {
          name: "Add Customer Name?",
        },
      },
    };
  },
  methods: {
    /**
     * Method for pulling details of the user logged in.
     */
    getAuthDetails: async function () {
      // https://medium.com/@dantasfiles/three-methods-to-get-user-information-in-aws-amplify-authentication-e4e39e658c33
      const userInfo = await Auth.currentSession();
      console.log("UserInfo=" + JSON.stringify(userInfo));
      this.userName =
        userInfo.getIdToken().payload.email ||
        "No email on the id token payload";
    },
    /**
     * Read the customers via AppSync
     * This service requires the user role to execute
     */
    getCustomers: async function () {
      try {
        const customers = await API.graphql({
          query: queries.getCustomers,
          variables: {},
          authMode: "AWS_IAM",
        });
        this.customers = customers;
      } catch (err) {
        // Todo can we detect the unauthorised request?
        console.log(err.response);
        window.location("/error");
      }
    },
    /**
     * Save the customer to using GraphQL and DynamoDB
     * This service requires the admin role to execute
     */
    addCustomer: async function () {
      try {
        const addCustomer = await API.graphql({
          query: mutations.addCustomer,
          variables: { customer: { name: this.formData.customer.name } },
          authMode: "AWS_IAM",
        });
        this.postBlogSubmissionHandler(true, "Successfully added the customer");
      } catch (err) {
        // Todo can we detect the unauthorised request?
        console.error("Error Response >>" + JSON.stringify(err) + "<<");
        this.postBlogSubmissionHandler(
          true,
          "Oh No, Something happened with your customer upload do you have permission?"
        );
      }
    },
    postBlogSubmissionHandler: function (success, message) {
      if (success) {
        this.getBlogs();
        this.formData.customer.name = "Add a Customer Name";
        this.customerAddStatus = message;
      } else {
        // error has occured
        this.customerAddStatus = message;
      }
    },
    /**
     *  SignOut()
     *  
     *  Please understand the expected behaviour with signout.
     *  I understand you want to know if we are aware of the  issue that`globalSignOut()` or`signOut()` does not immediately invalidate the token of the Cognito user. Therefore, the user would still be able to access the protected resources using existing tokens. Please correct me if I misunderstood.
        From the documentation[1] of the `globalSignOut()`, "This method signs out users from all devices. It also invalidates all refresh tokens issued to a user. The user's current access and Id tokens remain valid until their expiry. Access and Id tokens expire one hour after they are issued". 
        As the documentation clearly states that after the token is invalidated, the current tokens are still be valid for 1 hour from the time the tokens are issued. This means that When you perform signOut() or `globalSignOut()`, it just clears the tokens from local cache. However, if the tokens stored somewhere else, it is possible that you could still access the protected resources using the tokens until the current token expires. ie, after 60 minutes of token issue time. I understand this causes some issues such as user would still be able to access the protected resources after they are logged out. Unfortunately, at this moment there are no potential workarounds available to get around this behavior.
        As one of our member from service team commented on the issue[2], Cognito service team is working on this feature internally. I understand that the lack of the feature is causing inconvenience. I have added your voice to it along with the rest of our customers that are being actively requesting on this. Please be assured that the service team will take the feedback seriously and work towards improving the Cognito service for better customer experience. However, I will not be able to provide any ETA at this moment as a support engineer, I do not have visibility into service team priorities. Meanwhile, You could keep an eye on our what's new blog [3] for information regarding new feature releases.
        Please feel free to reach out to us if you have further queries and I'll be happy to assist you on the same.
        References
      -------------
        [1] https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GlobalSignOut.html
        [2] https://github.com/aws-amplify/amplify-js/issues/3435#issuecomment-578206493
        [3] https://aws.amazon.com/new/
     */
    signOut: async function () {
      try {
        await Auth.signOut({ global: true });
        window.location("/logout");
      } catch (error) {
        console.log("error signing out: ", error);
      }
    },
  },
  created() {
    this.getBlogs();
    this.getAuthDetails();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: circle;
  padding: 0;
}
li {
  padding-left: 16px;
}
li:before {
  content: "•"; /* Insert content that looks like bullets */
  padding-right: 8px;
  color: blue; /* Or a color you prefer */
}
a {
  color: #42b983;
}
</style>
