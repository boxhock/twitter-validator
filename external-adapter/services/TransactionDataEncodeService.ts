import Web3 from 'web3';
import { Resolution } from '@unstoppabledomains/resolution';

type DomainValidationData = {
  domainName: string;
  domainRecordValue: string;
  domainRecordSignature: string;
};

export default class TransactionDataEncodeService {
  constructor(
    private readonly web3: Web3 = new Web3(),
    private readonly resolution: Resolution = new Resolution(),
  ) {}

  encodeDomainValidationData(validationData: DomainValidationData): string {
    const domainNameHash = this.resolution.namehash(validationData.domainName);
    const domainTokenId = this.web3.utils.hexToNumberString(domainNameHash);
    return this.web3.eth.abi.encodeParameters(
      ['string', 'string', 'uint256'],
      [
        validationData.domainRecordValue,
        validationData.domainRecordSignature,
        domainTokenId,
      ],
    );
  }
}
