<a name="top"></a>

# external-initiator v0.0.1

Chainlink External Initiator

- [Runs](#Runs)
  - [Initiates Twitter Validation.](#Initiates-Twitter-Validation.)

---

# <a name='Runs'></a> Runs

## <a name='Initiates-Twitter-Validation.'></a> Initiates Twitter Validation.

[Back to top](#top)

```
POST /runs
```

### Headers - `Header`

| Name          | Type     | Description                                |
| ------------- | -------- | ------------------------------------------ |
| Authorization | `String` | <p>bearer token to pass authorization.</p> |

### Parameters - `Parameter`

| Name                  | Type     | Description                                                                         |
| --------------------- | -------- | ----------------------------------------------------------------------------------- |
| domainName            | `String` | <p>Name of validated domain.</p>                                                    |
| domainOwner           | `String` | <p>Ethereum address of current domain owner.</p>                                    |
| validationCode        | `String` | <p>Twitter unique hashtag used validation.</p>                                      |
| twitterUsernameKey    | `String` | <p><code>.crypto Resolver</code> key where twitter username will be set.</p>        |
| validatorSignatureKey | `String` | <p><code>.crypto Resolver</code> key where validation signature will be placed.</p> |

### Success response

#### Success response - `Success 200`

| Name                      | Type     | Description                                                                               |
| ------------------------- | -------- | ----------------------------------------------------------------------------------------- |
| data                      | `Object` |                                                                                           |
| data.id                   | `String` | <p>Job Run ID. Validation progress can be tracked via this id and Chainlink Explorer.</p> |
| data.attributes           | `Object` |                                                                                           |
| data.attributes.jobId     | `String` | <p>ID of the triggered job.</p>                                                           |
| data.attributes.createdAt | `String` | <p>Datetime of Job Run creation.</p>                                                      |

### Success response example

#### Success response example - `Success-Response:`

```json
{
  "data": {
    "id": "2cf990e968484d659bf4bd55623b7143",
    "attributes": {
      "jobId": "5fa0641543b34c8e85fde0ecc10f7eb4",
      "createdAt": "2020-06-15T08:50:44.474824646Z"
    }
  }
}
```

### Error response

#### Error response - `Error 4xx`

| Name           | Type | Description                                   |
| -------------- | ---- | --------------------------------------------- |
| InvalidRequest |      | <p>parameters have not passed validation.</p> |

### Error response example

#### Error response example - `Error-Response:`

```json
{
  "name": "BadRequestError",
  "message": "Invalid body, check 'errors' property for more info.",
  "stack": "Error: \n    at BadRequestError.HttpError [as constructor]",
  "errors": [
    {
      "target": {
        "invalid": "request"
      },
      "property": "domainName",
      "constraints": {
        "matches": "domainName must match /(crypto)$/ regular expression",
        "isString": "domainName must be a string"
      }
    },
    {
      "target": {
        "invalid": "request"
      },
      "property": "domainOwner",
      "constraints": {
        "isEthereumAddress": "domainOwner must be an Ethereum address"
      }
    }
  ]
}
```
