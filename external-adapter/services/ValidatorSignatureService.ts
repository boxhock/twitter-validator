import Web3 from 'web3';
import config from '../config';

const web3 = new Web3();

type SignParameters = {
  domainName: string;
  domainOwner: string;
  domainRecordKey: string;
  domainRecordValue: string;
};

export default class ValidatorSignatureService {
  constructor(
    private readonly privateKey: string = config.VALIDATOR_PRIVATE_KEY,
  ) {}

  sign(parameters: SignParameters): string {
    const messageToSign = [
      parameters.domainName,
      parameters.domainOwner,
      parameters.domainRecordKey,
      parameters.domainRecordValue,
    ]
      .map((value) => web3.utils.keccak256(value))
      .reduce((message, hashedValue) => message + hashedValue, '');

    const signResult = web3.eth.accounts.sign(messageToSign, this.privateKey);

    return signResult.signature;
  }
}
