import ValidatorSignatureService from './ValidatorSignatureService';
import Web3 from 'web3';

const web3 = new Web3();

describe('ValidatorSignatureService', () => {
  const service = new ValidatorSignatureService();

  it('should return string', () => {
    expect(
      service.sign({
        domainName: 'test.crypto',
        domainOwner: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
        domainRecordKey: 'validation.twitter.name',
        domainRecordValue: 'Apple',
      }),
    ).toBeDefined();
  });

  it('should return recoverable signature', () => {
    const parameters = {
      domainName: 'test.crypto',
      domainOwner: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
      domainRecordKey: 'validation.twitter.name',
      domainRecordValue: 'Apple',
    };
    const signature = service.sign(parameters);
    const publicAddress = web3.eth.accounts.recover('any message', signature);
    expect(web3.utils.isAddress(publicAddress)).toBeTruthy();
  });
});
