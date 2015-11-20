# node-steam-key

Exposes an API to activate game/CD keys on Steam via NodeJS.

# Notice

By using this library, I (Joshua Ferrara) am relieved of any legal issues you run into while using this library. Activating Steam keys via an API is a touchy subject and is most likely frowned upon. Keep this in mind while using this library.

Finally, I do not provide **any** support for this library. **Use at your own risk.** Feel free to make any pull requests, though.

# Usage

Initialize a SteamRegistrar object and call the methods below on the created object. Refer to example.js for a full example.

### Methods

##### `activateKey(string key)` - Sends a request to activate a product key. Listen for the `purchaseResponse` event.

```javascript
SteamRegistrar.activateKey("AAAAA-BBBBB-CCCCC");
```

### Events

##### `purchaseResponse` - emitted in reponse to `activateKey(string key)`.

An `eresult` of `1` seems to be a valid activation, while an `eresult` of anything else might be invalid. I've set any integers to be zeroes in the event they contain sensitive information. I have no concrete idea as to what these numbers mean - if anyone has an idea, feel free to edit the README and make a pull request.

```
{ eresult: 2,
  purchase_result_details: 14,
  purchase_receipt_info:
   { MessageObject:
      { TransactionID: [Object],
        paymentMethod: 00000000,
        PurchaseStatus: 00000000,
        ResultDetail: 000000000,
        BasePrice: 0,
        TotalDiscount: 0,
        Tax: 0,
        Shipping: 0,
        CurrencyCode: 0,
        TransactionTime: -0000000000,
        PackageID: -1,
        ErrorHeadline: '',
        ErrorString: '',
        ErrorLinkText: '',
        ErrorLinkURL: '' } } }
```

# License

MIT