<a name="top"></a>

# external-adapter v0.0.1

Chainlink External Adapter

- [Twitter](#Twitter)
  - [Validate twitter account and return signature and twitter username packed as smart contract arguments (transaction data). This endpoint should be called by Chainlink Node as a part of the Job.](<#Validate-twitter-account-and-return-signature-and-twitter-username-packed-as-smart-contract-arguments-(transaction-data).-This-endpoint-should-be-called-by-Chainlink-Node-as-a-part-of-the-Job.>)

---

# <a name='Twitter'></a> Twitter

## <a name='Validate-twitter-account-and-return-signature-and-twitter-username-packed-as-smart-contract-arguments-(transaction-data).-This-endpoint-should-be-called-by-Chainlink-Node-as-a-part-of-the-Job.'></a> Validate twitter account and return signature and twitter username packed as smart contract arguments (transaction data). This endpoint should be called by Chainlink Node as a part of the Job.

[Back to top](#top)

```
POST /twitter/validate
```

### Parameters - `Parameter`

| Name                | Type     | Description                                      |
| ------------------- | -------- | ------------------------------------------------ |
| id                  | `String` | <p>Job Run ID</p>                                |
| data                | `Object` |                                                  |
| data.domainName     | `String` | <p>Name of validated domain.</p>                 |
| data.domainOwner    | `String` | <p>Ethereum address of current domain owner.</p> |
| data.validationCode | `String` | <p>Twitter unique hashtag used validation.</p>   |
