# Utility Script for Binding IoTF devices with Jasper 

This Script will help you to bulk bind your IoT Foundation devices with Jasper

### Input

##### creds.prop
This properties file contains the application credentials for connecting to the Internet of Things Foundation. The API key and Token can be generated in the [Internet of Things Foundation Dashboard](http://internetofthings.ibmcloud.com/).
```
org=myOrgId
id=MyAppId
auth-key=a-xxxxx-xxxxxxxxx
auth-token=xxxxxxxxxx@Ti
```

##### devices.csv
This csv file contains the details of the IoT Foundation devices and the ICCID of the Jasper Device. It is of the format

1. Device Type - Type of device in IoTF
2. Device ID - Id of the device in IoTF
3. ICCID - The ICCID of the device in Jasper which is to be bound
```
DeviceType,DeviceID,ICCID
sampleType,id1,89302720396917145075
```

## Running the script
```
npm install
node main.js
```

##### Process of this script
1. Check if the device exists in the IoTF Organization
2. If the device exists, it will update the device with the ICCID of the Jasper Device
3. If the device does not exist, it will first create the device, save the device token in `createdDevices.csv` and then update the device with the ICCID of the Jasper Device

Note : For the devices that was created by the script, the device tokens will be written to a file named `createdDevices.csv`.
