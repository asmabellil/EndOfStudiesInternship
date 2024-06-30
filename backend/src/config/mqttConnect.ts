/* eslint-disable @typescript-eslint/no-shadow */
import mqtt from 'mqtt';
import consts from '@config/consts';
import logger from '@core/utils/logger';

// Set the host and port based on the connection information.
const { host, port, clientId, protocol } = consts;
const connectUrl = `${protocol}://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: consts.usernameMQTT,
  password: consts.passwordMQTT,
  reconnectPeriod: 1000,
});

const topic = '/nodejs/mqtt';

client.on('connect', () => {
  logger.debug('Connected');

  client.subscribe([topic], () => {
    logger.debug(`Subscribe to topic '${topic}'`);
    client.publish(
      topic,
      'nodejs mqtt test',
      { qos: 0, retain: false },
      (error) => {
        if (error) {
          logger.error(error);
        }
      },
    );
  });
});

client.on('message', (topic, payload) => {
  logger.debug('Received Message:', topic, payload.toString());
});

export default client;
export { topic };

/* https://github.com/donskytech/mqtt-node */
