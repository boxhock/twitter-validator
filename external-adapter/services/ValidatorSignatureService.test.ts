import ValidatorSignatureService, {
  InvalidPrivateKeyError,
  SignatureParameters,
} from './ValidatorSignatureService';
import Web3 from 'web3';
import config from '../config';

const web3 = new Web3();

describe('ValidatorSignatureService', () => {
  const service = new ValidatorSignatureService();
  let signatureParameters: SignatureParameters;

  beforeEach(() => {
    signatureParameters = {
      domainName: 'test.crypto',
      domainOwner: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
      domainRecordKey: 'validation.twitter.name',
      domainRecordValue: 'Apple',
    };
  });

  it('should return string', () => {
    expect(service.sign(signatureParameters)).toBeDefined();
  });

  it('should return recoverable signature', () => {
    const signature = service.sign(signatureParameters);
    const address = web3.eth.accounts.recover('any message', signature);
    expect(web3.utils.isAddress(address)).toBeTruthy();
  });

  it('should return expected signature', () => {
    const expectedSignature =
      '0x0da02c1fbab1be1f9bcb68db88d6782d9c0e8128c36185b3eee464500c1ac22a73c3bc81b7b77e106ac1fa92695cf08b32faed6477d2994236ac27eeb38d41151c';
    const signature = service.sign(signatureParameters);
    expect(signature).toEqual(expectedSignature);
  });

  it('should recover expected address from signature', () => {
    const expectedAddress = web3.eth.accounts.privateKeyToAccount(
      config.VALIDATOR_PRIVATE_KEY,
    ).address;
    const signature = service.sign(signatureParameters);
    const messageToSign = [
      signatureParameters.domainName,
      signatureParameters.domainOwner,
      signatureParameters.domainRecordKey,
      signatureParameters.domainRecordValue,
    ]
      .map((value) => web3.utils.keccak256(value))
      .reduce((message, hashedValue) => message + hashedValue, '');
    const recoveredAddress = web3.eth.accounts.recover(
      messageToSign,
      signature,
    );
    expect(recoveredAddress).toEqual(expectedAddress);
  });

  it('should throw error if invalid private key was set', () => {
    try {
      new ValidatorSignatureService('ssss');
      fail('Should fail with invalid private key');
    } catch (e) {
      expect(e instanceof InvalidPrivateKeyError).toBeTruthy();
    }

    try {
      new ValidatorSignatureService('');
      fail('Should fail with invalid private key');
    } catch (e) {
      expect(e instanceof InvalidPrivateKeyError).toBeTruthy();
    }
  });
});
