import {
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export default class JobRunRequest {
  @IsString()
  @Matches(/(crypto)$/)
  domainName: string;

  @IsEthereumAddress()
  domainOwner: string;

  @IsString()
  @IsNotEmpty()
  validationCode: string;
}
