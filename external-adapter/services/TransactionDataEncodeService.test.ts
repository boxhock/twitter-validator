import Web3 from 'web3';
import Resolution from '@unstoppabledomains/resolution';
import TransactionDataEncodeService from './TransactionDataEncodeService';

const web3 = new Web3();
const resolution = new Resolution();

function encodeData(
  domainName: string,
  keys: string[],
  values: string[],
): string {
  const domainTokenId = web3.utils.hexToNumberString(
    resolution.namehash(domainName),
  );
  return web3.eth.abi.encodeParameters(
    ['string[]', 'string[]', 'uint256'],
    [keys, values, domainTokenId],
  );
}

describe('TransactionDataEncodeService', () => {
  const service = new TransactionDataEncodeService();
  it('should return encoded data', () => {
    const expectedData = encodeData('test.crypto', ['test'], ['value']);
    const encodedData = service.encodeDomainValidationData({
      domainName: 'test.crypto',
      records: { test: 'value' },
    });
    expect(encodedData).toEqual(expectedData);
  });

  it('should return encoded data for empty records', () => {
    const expectedData = encodeData('empty.crypto', [], []);
    const encodedData = service.encodeDomainValidationData({
      domainName: 'empty.crypto',
      records: {},
    });
    expect(encodedData).toEqual(expectedData);
  });

  it('should throw error if domain name not valid', () => {
    expect(() =>
      service.encodeDomainValidationData({
        domainName: 'invalid.com',
        records: {},
      }),
    ).toThrow();
  });
});
