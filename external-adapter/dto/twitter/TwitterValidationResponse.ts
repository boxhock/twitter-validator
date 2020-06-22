type TwitterValidationResponse = {
  jobRunID: string;
  data: {
    domainName: string;
    twitterUsernameKey: string;
    twitterUsernameValue: string;
    validatorSignatureKey: string;
    validatorSignatureValue: string;
  };
};

export default TwitterValidationResponse;
