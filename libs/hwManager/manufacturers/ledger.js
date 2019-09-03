/* istanbul ignore file */
import { LedgerAccount, SupportedCoin, DposLedger } from 'dpos-ledger-api';
import {
  getBufferToHex,
  getTransactionBytes,
} from '../utils/utils';
import {
  ADD_DEVICE,
  MANUFACTURERS,
} from '../utils/constants';

// ============================================ //
//              DEVICES LIST
// ============================================ //
let devices = [];

/**
 * addDevice - function - Add a new device to the devices list.
 * @param {object} device - Device object comming from the ledeger library
 * @param {string} path - Path of the device used for the library to recognize it (dscriptor)
 * @param {function} add - Function that use for main file to include the device in the main list.
 */
const addDevice = (device, path, { add }) => {
  const newDevice = {
    deviceId: `${Math.floor(Math.random() * 1e5) + 1}`,
    label: device.productName,
    model: device.productName,
    path,
    manufactor: MANUFACTURERS.Ledger.name,
  };

  devices.push(newDevice);
  add(newDevice);
};

/**
 * removeDevice - funcion - Remove a device from the main list and the device array.
 * @param {object} transport - Library use for get information about ledger.
 * @param {function} remove - Function for remove a device from the main list.
 */
const removeDevice = async (transport, { remove }) => {
  const connectedPaths = await transport.list();
  devices
    .filter(device => !connectedPaths.includes(device.path))
    .forEach(device => remove(device.path));
  devices = devices.filter(device => connectedPaths.includes(device.path));
};

/**
 * listener - function - Always listen for new messages for connect or disconnect devices.
 * @param {object} transport - Library use for handle the ledger devices.
 * @param {object} actions - Contains 2 functions: add and remove.
 * @param {function} actions.add - Function for add a new device to the main list.
 * @param {function} actions.remove - Function for remove a device to the main list.
 */
const listener = (transport, actions) => {
  try {
    transport.listen({
      next: ({ type, deviceModel, descriptor }) => {
        if (deviceModel && descriptor) {
          if (type === ADD_DEVICE) addDevice(deviceModel, descriptor, actions);
          removeDevice(transport, actions);
        }
      },
    });
  } catch (e) {
    throw e;
  }
};

/**
 * geteLedgerAccount - function - Check if account exist for selected coin
 * @param {number} index - indeex for the desire account, if not value is provide use default (0)
 */
const getLedgerAccount = (index = 0) => {
  const ledgerAccount = new LedgerAccount();
  ledgerAccount.coinIndex(SupportedCoin.LISK);
  ledgerAccount.account(index);
  return ledgerAccount;
};

/**
 * checkIfInsideLiskApp - function - Validate if after use the pin to unblock ldeger device
 * the user is inside the LSK App, if not then will show the device as connected but not
 * able to get accounts from the device.
 * @param {object} param - Object with 2 elements, a transport and device.
 * @param {object} param.transporter - Object for handle the ledger device.
 * @param {object} param.device - Object with device information.
 */
const checkIfInsideLiskApp = async ({
  transporter,
  device,
}) => {
  let transport;
  try {
    transport = await transporter.open(device.path);
    const liskLedger = new DposLedger(transport);
    const ledgerAccount = getLedgerAccount();
    const account = await liskLedger.getPubKey(ledgerAccount);
    device.openApp = !!account;
  } catch (e) {
    device.openApp = false;
  }
  if (transport) transport.close();
  return device;
};

// TODO after move the logic of each event to separate functions we can remove
// the eslint for max statements
// eslint-disable-next-line max-statements
const executeCommand = async (transporter, {
  device,
  action,
  data,
}) => {
  let transport;
  try {
    transport = await transporter.open(device.path);
    const liskLedger = new DposLedger(transport);
    const ledgerAccount = getLedgerAccount(data.index);

    switch (action) {
      // TODO use contants instead of hardcoded text for events and move the logic to functions
      case 'GET_PUBLICKEY': {
        const { publicKey: res } = await liskLedger.getPubKey(ledgerAccount, data.showOnDevice);
        transport.close();
        return res;
      }

      // TODO use contants instead of hardcoded text for events and move the logic to functions
      case 'SIGN_TX': {
        const signature = await liskLedger.signTX(
          ledgerAccount,
          getTransactionBytes(data.tx),
          false,
        );
        transport.close();
        const res = getBufferToHex(signature);
        return res;
      }

      default: {
        // eslint-disable-next-line no-console
        console.log(`No action created for: ${device.manufactor}.${action}`);
        return null;
      }
    }
  } catch (err) {
    transport.close();
    throw new Error(err);
  }
};

export default {
  listener,
  checkIfInsideLiskApp,
  executeCommand,
};
