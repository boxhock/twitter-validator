import ValidatorSignatureService, {
  InvalidPrivateKeyError,
  SignatureParameters,
} from './ValidatorSignatureService';
import Web3 from 'web3';
import config from '../config';
import { ecrecover, toBuffer } from 'ethereumjs-util';

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
    const result = service.sign(signatureParameters);
    const address = web3.eth.accounts.recover('any message', result.signature);
    expect(web3.utils.isAddress(address)).toBeTruthy();
  });

  it('should return expected signature', () => {
    const expectedSignature =
      '0x0da02c1fbab1be1f9bcb68db88d6782d9c0e8128c36185b3eee464500c1ac22a73c3bc81b7b77e106ac1fa92695cf08b32faed6477d2994236ac27eeb38d41151c';
    const result = service.sign(signatureParameters);
    expect(result.signature).toEqual(expectedSignature);
  });

  it('should recover expected address from signature', () => {
    const expectedAddress = web3.eth.accounts.privateKeyToAccount(
      config.VALIDATOR_PRIVATE_KEY,
    ).address;
    const result = service.sign(signatureParameters);
    const recoveredAddress = web3.eth.accounts.recover(
      result.message,
      result.signature,
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

  it('should extract validator public key from signature', () => {
    const result = service.sign(signatureParameters);
    const messageHash = toBuffer(result.messageHash);
    const v = Number(result.v);
    const r = toBuffer(result.r);
    const s = toBuffer(result.s);
    const recoveredPublicKey = ecrecover(messageHash, v, r, s);
    expect(toBuffer(config.VALIDATOR_PUBLIC_KEY)).toEqual(recoveredPublicKey);
  });
});
