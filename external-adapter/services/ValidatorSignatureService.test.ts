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
    const messageToSign =
      '0xc2205449ba055ad2e6cd2d70b65a7747a42e665a0f117e623f97e48879b7f9510xb9dad69db0f578edc4cad1a5009df28aa8c7f1cfac6e3c95e1549bef16b7ec990x27a3e023b3b6a9bfeeaa699a7e1fdecafbc11c3cdae33c06270517b5a61a4ead0x14851888cf824d1588209f3afbbfa9d2275da13e228c93765dd00d895530ded1';
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
