import Web3 from 'web3';
import config from '../config';

export type SignatureParameters = {
  domainName: string;
  domainOwner: string;
  domainRecordKey: string;
  domainRecordValue: string;
};

export class InvalidPrivateKeyError extends Error {}

export default class ValidatorSignatureService {
  constructor(
    private readonly privateKey: string = config.VALIDATOR_PRIVATE_KEY,
    private readonly web3: Web3 = new Web3(),
  ) {
    try {
      this.web3.eth.accounts.privateKeyToAccount(this.privateKey);
    } catch (e) {
      throw new InvalidPrivateKeyError(
        'Invalid private key was set. Check VALIDATOR_PRIVATE_KEY env variable',
      );
    }
  }

  sign(parameters: SignatureParameters): string {
    const messageToSign = [
      parameters.domainName,
      parameters.domainOwner,
      parameters.domainRecordKey,
      parameters.domainRecordValue,
    ]
      .map((value) => this.web3.utils.keccak256(value))
      .reduce((message, hashedValue) => message + hashedValue, '');
    const signResult = this.web3.eth.accounts.sign(
      messageToSign,
      this.privateKey,
    );
    return signResult.signature;
  }
}
