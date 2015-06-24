# conforma
Filter, validate and conform your data from POST request data in Express

## Install
npm install conforma --save

## Usage

```javascript
var conforma = require('./index');

var formData = new conforma.Conforma();

formData.setData({
  value1: '123',
  value2: 'yes',
  nested: {
    value1: 'email(at)localhost',
    value2: 'Hänsel und Gretel ',
    value4: 'SOME TRASH'
  },
  trashValue: 'foobar'
}).default({
  value1: 1,
  value3: 'foobar',
  nested: {
    value3: '   <html>Hello World!</html>'
  }
}).conform({
  value1: true,
  value2: true,
  nested: {
    value1: true,
    value2: true,
    value3: true
  }
})
  .filter('value1', 'int')
  .filter('value2', 'bool')
  .filter('nested.value2', ['trim', 'toUpperCase'])
  .filter('nested.value3', ['string', 'trim', 'escapeHtml'])
  .validate('nested.value1', ['email', 'required'])
  .validate('nested.value2', 'alpha', true)
  .exec(function(err, data) {
    if(err) {
      console.log('Error: ', err);
    }

    console.log('Data: ', data);
  });
```

If your data is invalid, then you get error:

```javascript
{ 
  [Error: Conforma Validation Error]
  errors: 
   [ { name: 'ConformaError',
       message: 'email.invalid.format %s',
       field: 'nested.value1',
       value: 'email(at)localhost' 
     },
     { name: 'ConformaError',
       message: 'only.alpha.allowed',
       field: 'nested.value2',
       value: 'HÄNSEL UND GRETEL' 
     } ]
}
```

If your data is valid, then you get the filtered and validated data:
```javascript
{ value1: 123,
  value2: true,
  nested: 
   { value1: 'email(at)localhost',
     value2: 'HÄNSEL UND GRETEL',
     value3: '&lt;html&gt;Hello World!&lt;/html&gt;'
   } 
}
```

## API
* .setData(object)
* .getData(filtered)
* .filter(key, filter)
* .validate(key, validator, options)
* .exec(callback) return Promise
* .reset

## TODO
* extend all tests
* create some examples
* extend README
* your suggestion
* bug fixing

