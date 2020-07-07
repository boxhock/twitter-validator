import Web3 from 'web3';
import Resolution from '@unstoppabledomains/resolution';
import TransactionDataEncodeService from './TransactionDataEncodeService';

const web3 = new Web3();
const resolution = new Resolution();

function encodeData(
  domainName: string,
  domainRecordValue: string,
  domainRecordSignature: string,
): string {
  const domainTokenId = web3.utils.hexToNumberString(
    resolution.namehash(domainName),
  );
  return web3.eth.abi.encodeParameters(
    ['string', 'string', 'uint256'],
    [domainRecordValue, domainRecordSignature, domainTokenId],
  );
}

describe('TransactionDataEncodeService', () => {
  const service = new TransactionDataEncodeService();
  it('should return encoded data', () => {
    const expectedData = encodeData('test.crypto', 'rainberk', 'signature');
    const encodedData = service.encodeDomainValidationData({
      domainName: 'test.crypto',
      domainRecordValue: 'rainberk',
      domainRecordSignature: 'signature',
    });
    expect(encodedData).toEqual(expectedData);
  });

  it('should return encoded data for empty records', () => {
    const expectedData = encodeData('empty.crypto', '', '');
    const encodedData = service.encodeDomainValidationData({
      domainName: 'empty.crypto',
      domainRecordValue: '',
      domainRecordSignature: '',
    });
    expect(encodedData).toEqual(expectedData);
  });

  it('should return expected encoded string', () => {
    const expectedData =
      '0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0b72f443a17edf4a55f766cf3c83469e6f96494b16823a41a4acb25800f30310300000000000000000000000000000000000000000000000000000000000000087261696e6265726b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000097369676e61747572650000000000000000000000000000000000000000000000';
    const encodedData = service.encodeDomainValidationData({
      domainName: 'test.crypto',
      domainRecordValue: 'rainberk',
      domainRecordSignature: 'signature',
    });
    expect(encodedData).toEqual(expectedData);
  });

  it('should throw error if domain name not valid', () => {
    expect(() =>
      service.encodeDomainValidationData({
        domainName: 'invalid.com',
        domainRecordValue: '',
        domainRecordSignature: '',
      }),
    ).toThrow();
  });
});
