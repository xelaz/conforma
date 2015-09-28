# conforma
Filter, validate and conform your data from POST request data in Express

## Install
npm install conforma --save

## Usage

More examples you can find in example path or in test.

```javascript

    var conforma = require('conforma');

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
      value1: undefined,
      value2: undefined,
      nested: {
        value1: undefined,
        value2: undefined,
        value3: undefined
      }
    })
      .filter('value1', 'int')
      .filter('value2', 'bool')
      .filter('nested.value2', ['trim', 'toUpperCase'])
      .filter('nested.value3', ['string', 'trim', 'escapeHtml'])
      .validate('nested.value1', ['email', 'required'])
      .validate('nested.value2', {alpha: true})
      .exec(function(err, data) {
        err &&  console.log('Error: ', err);
        data && console.log('Data: ', data);
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

    {
      value1: 123,
      value2: true,
      nested:
       { value1: 'email(at)localhost',
         value2: 'HÄNSEL UND GRETEL',
         value3: '&lt;html&gt;Hello World!&lt;/html&gt;'
       }
    }
```

### Use with Promise

```javascript
    var conforma = require('conforma');
    var formData = new conforma.Conforma();

    formData.setData({
      value1: '123',
      value2: 'yes'
    })
      .filter('value1', 'int')
      .filter('value2', 'bool')
      .exec()
      .then(function(data) {
        // ...
      })
      .catch(function(error) {
        // ...
      });
```

### Use with your local filter/validator

```javascript

    var conforma = require('conforma');
    var formData = new conforma.Conforma();

    formData.setData({
      value1: '123',
      value2: 'yes'
    })
      .filter('value1', 'int')
      .filter('value2', 'bool')
      .exec()
      .then(function(data) {
        // ...
      })
      .catch(function(error) {
        // ...
      });
```


## API
* setData(object)
* getData(filtered)
* filter(path, filter)
* validate(path, validator)
* move(srcPath, destPath)
* remove(path)
* exec(callback) return Promise
* reset

## Filter
* int
* float
* bool
* string
* trim whitespaces
* lowerCase
* upperCase
* escapeHtml (<>"'& to entities)
* addslashes (like php)
* stripHtml (sanitize all html content)
* email
* url [node url object keys]
* date [moment format]

## Validator
* required
* email
* emailMx
* alpha (UTF8 and whitespaces)
* alnum (UTF8 and whitespaces)
* notEmpty
* equals
* compare (with other fields)
* contains
* isDate (format please use moment)
* inList
* length (min, max)

## TODO
* extend all tests
* create some examples
* extend validator/filter
* extend README
* your suggestion
* i18n error messages
* bug fixing

[![Build Status](https://travis-ci.org/xelaz/conforma.svg?branch=master)](https://travis-ci.org/xelaz/conforma)