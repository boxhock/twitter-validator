import Web3 from 'web3';
import { Resolution } from '@unstoppabledomains/resolution';
import * as _ from 'lodash';

type DomainValidationData = {
  domainName: string;
  records: Record<string, string>;
};

export default class TransactionDataEncodeService {
  constructor(
    private readonly web3: Web3 = new Web3(),
    private readonly resolution: Resolution = new Resolution(),
  ) {}

  encodeDomainValidationData(validationData: DomainValidationData): string {
    const domainNameHash = this.resolution.namehash(validationData.domainName);
    const domainTokenId = this.web3.utils.hexToNumberString(domainNameHash);
    const records = validationData.records;
    const recordsKeys = !_.isEmpty(records) ? Object.keys(records) : [];
    const recordsValues = !_.isEmpty(records) ? Object.values(records) : [];

    return this.web3.eth.abi.encodeParameters(
      ['string[]', 'string[]', 'uint256'],
      [recordsKeys, recordsValues, domainTokenId],
    );
  }
}
