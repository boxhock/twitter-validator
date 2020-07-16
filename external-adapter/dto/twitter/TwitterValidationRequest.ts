import 'reflect-metadata';
import {
  IsDefined,
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import Web3 from 'web3';
import { Type } from 'class-transformer';

const web3 = new Web3();

class ValidationData {
  @IsString()
  @Matches(/(crypto)$/)
  domainName: string;

  @IsEthereumAddress()
  domainOwner: string;

  @IsString()
  @IsNotEmpty()
  validationCode: string;

  getDomainName(): string {
    return this.domainName.toLowerCase();
  }

  getDomainOwner(): string {
    return web3.utils.toChecksumAddress(this.domainOwner);
  }

  getValidationCode(): string {
    return this.validationCode;
  }
}

export default class TwitterValidationRequest {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => ValidationData)
  data: ValidationData;
}
