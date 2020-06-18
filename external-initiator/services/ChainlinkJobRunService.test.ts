import nock from 'nock';
import config from '../config';
import ChainlinkJobRunService from './ChainlinkJobRunService';
import JobRunCreated from '../mocks/chainlink-node/responses/JobRunCreated.json';
import JobNotFound from '../mocks/chainlink-node/responses/JobNotFound.json';

describe('ChainlinkJobRunService', () => {
  const jobRunPath = `/v2/specs/${config.CHAINLINK.JOB_ID}/runs`;
  const expectedJobPayload = { job: 'payload' };
  const jobRunService = new ChainlinkJobRunService();
  const mockedHttpCall = nock(config.CHAINLINK.NODE_URL as string).post(
    jobRunPath,
    expectedJobPayload,
    {
      reqheaders: {
        'X-Chainlink-EA-AccessKey': config.CHAINLINK.ACCESS_KEY,
        'X-Chainlink-EA-Secret': config.CHAINLINK.ACCESS_SECRET,
      },
    },
  );

  it('should create new job', async () => {
    mockedHttpCall.reply(200, JobRunCreated);
    const jobRunData = await jobRunService.createJobRun(expectedJobPayload);
    expect(jobRunData).toEqual(JobRunCreated);
  });

  it('should return null if job not found', async () => {
    mockedHttpCall.reply(404, JobNotFound);
    const jobRunData = await jobRunService.createJobRun(expectedJobPayload);
    expect(jobRunData).toEqual(null);
  });

  it('should throw error if get errors from Chainlink Node', async () => {
    mockedHttpCall.reply(400);
    await expect(
      jobRunService.createJobRun(expectedJobPayload),
    ).rejects.toThrowError('Failed request');

    mockedHttpCall.reply(401);
    await expect(
      jobRunService.createJobRun(expectedJobPayload),
    ).rejects.toThrowError('Failed request');

    mockedHttpCall.reply(500);
    await expect(
      jobRunService.createJobRun(expectedJobPayload),
    ).rejects.toThrowError('Failed request');
  });

  it('should return error status code', async () => {
    mockedHttpCall.reply(401);
    try {
      await jobRunService.createJobRun(expectedJobPayload);
      fail('Test should throw error');
    } catch (e) {
      expect(e.statusCode).toEqual(401);
    }
  });
});
