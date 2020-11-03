'use strict';

$(document).ready(function () {
  //disable context
  $(document).bind("contextmenu", function (e) {
    return false;
  });

  // form-input
  $('input').focus(function () {
    $(this).parents('.form-group').addClass('focused');
  });

  $('input').blur(function () {
    var inputValue = $(this).val();
    if (inputValue == "") {
      $(this).removeClass('filled');
      $(this).parents('.form-group').removeClass('focused');
    } else {
      $(this).addClass('filled');
    }
  });

  //validate email
  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6})+$/;
    return regex.test(email);
  };

  // validate form - user-form
  var email = $('#email');
  var customerSubmitLabel = $('#customer_form_label');
  var customerSubmit = $('#customer_form_submit');
  var text_inputs = $('.user-form input[type=text]:not([name=address2])');
  var country_select = $('select[name=country]');
  var terms = $('#terms');

  function inputsFilled(inputs_selector) {
    var text_inputs_filled_arr = [];
    var text_inputs_filled = false;

    // text inputs require validation
    inputs_selector.each(function () {
      if ($(this).val() === '') {
        text_inputs_filled_arr.push(false)
        $(this).closest('div').addClass('required');
      } else {
        text_inputs_filled_arr.push(true)
        $(this).closest('div').removeClass('required');
      }
    })

    // check if all text inputs are filled
    text_inputs_filled = !text_inputs_filled_arr.includes(false);

    return text_inputs_filled;
  }

  var form_validation = function () {
    // email validation
    if (!isEmail(email.val()) && !email.hasClass('required')) {
      email.closest('div').addClass('invalid-email');
    } else {
      email.closest('div').removeClass('invalid-email');
    }

    // text inputs require validation
    inputsFilled(text_inputs);

    // form validation
    if (isEmail(email.val()) &&
      inputsFilled(text_inputs) === true &&
      country_select.val() !== "" &&
      $(terms).is(':checked')
    ) {
      customerSubmit.removeAttr('disabled');
      customerSubmitLabel.removeClass('disabled');
    } else {
      customerSubmit.attr('disabled', 'disabled');
      customerSubmitLabel.addClass('disabled');
    }
  };

  email.change(function () {
    form_validation()
  });

  email.keyup(function () {
    form_validation()
  });

  text_inputs.keyup(function () {
    form_validation()
  });

  terms.click(form_validation);

  // validate form - card-form
  var cardSubmitLabel = $('#card_form_label');
  var cardSubmit = $('#card_form_submit');
  var card_text_inputs = $('.card-form input:not([type=submit])');

  // inputsFilled()

  function card_validation_handler() {
    // inputs require validation
    inputsFilled(card_text_inputs);

    // form validation
    if (inputsFilled(card_text_inputs) === true) {
      cardSubmit.removeAttr('disabled');
      cardSubmitLabel.removeClass('disabled');
    } else {
      cardSubmit.attr('disabled', 'disabled');
      cardSubmitLabel.addClass('disabled');
    }
  }

  card_text_inputs.keyup(function () {
    card_validation_handler()
  });

  /* setup modal */
  var termsBtn = $('.terms-btn');
  var policyBtn = $('.policy-btn');
  var informationProvided = $('.information-provided');
  var termsModal = $('#modal-terms');
  var policyModal = $('#modal-policy');
  var modalInformation = $('#modal-information');
  var closeBtn = $('.ui-close-modal');

  termsBtn.on('click', function () {
    termsModal.addClass('show');
  });

  policyBtn.on('click', function () {
    policyModal.addClass('show');
  });

  informationProvided.on('click', function () {
    modalInformation.addClass('show');
  });

  closeBtn.on('click', function () {
    termsModal.removeClass('show');
    policyModal.removeClass('show');
    modalInformation.removeClass('show');
  });

  // close modal by clicking outside the modal window
  $('.modal-wrap').click(function (e) {
    if (e.target === $('.modal-wrap.show')[0]) {
      $('.modal-wrap').removeClass('show');
    }
  })
  /* end modal */

  // // get poll_session
  // var req = new XMLHttpRequest();
  // req.open('GET', document.location, false);
  // req.send(null);
  // var headers = req.getAllResponseHeaders().toLowerCase();
  // var headersArr = headers.trim().split('\n');

  // function getPollSession(arr) {
  //   var poll_session;

  //   arr.forEach(function (item) {
  //     var ItemKey = item.split(':')[0];
  //     var itemValue = item.split(':')[1];

  //     if (ItemKey === 'poll-session') {
  //       poll_session = itemValue;
  //     }
  //   })
  //   return poll_session;
  // }

  // var poll_session = getPollSession(headersArr) !== undefined ? getPollSession(headersArr).trim() : false;

  // // get timezone offset
  // var date = new Date();
  // const currentTimeZoneOffsetInHours_func = () => {
  //   let offset = date.getTimezoneOffset() / 60;
  //   if (Math.sign(offset) === -1) {
  //     return Math.abs(offset);
  //   }
  //   if (Math.sign(offset) === 1) {
  //     return -Math.abs(offset);
  //   }
  //   if (Math.sign(offset) === 0 && Math.sign(offset) === -0) {
  //     return Math.abs(offset);
  //   }
  // };

  // const currentTimeZoneOffsetInHours = currentTimeZoneOffsetInHours_func();
  // console.log(currentTimeZoneOffsetInHours)

  // // send timezone offset to server
  // var setTimezoneReques_sent = sessionStorage.getItem('setTimezoneReques_sent');
  // if (setTimezoneReques_sent !== 'true' && poll_session) {
  //   var base_url = window.location.origin;
  //   var setTimezoneRequest_Url = `${base_url}/bo/poll-sessions/${poll_session}/set-tz-offset/${currentTimeZoneOffsetInHours}/`;
  //   $.ajax({
  //     url: setTimezoneRequest_Url,
  //     type: "GET",
  //     success: function (data) {
  //       console.log(data);
  //       // set setTimezoneReques_sent to true
  //       sessionStorage.setItem('setTimezoneReques_sent', 'true');
  //     },
  //     error: function (error_data) {
  //       console.log(error_data);
  //     }
  //   });
  // };

  // card inputs mask
  var app;

  (function () {
    'use strict';

    app = {
      monthAndSlashRegex: /^\d\d \/ $/, // regex to match "MM / "
      monthRegex: /^\d\d$/, // regex to match "MM"

      el_cardNumber: '.ccFormatMonitor',
      el_expDate: '#inputExpDate',
      el_cvv: '.cvv',
      el_ccUnknown: 'cc_type_unknown',
      el_ccTypePrefix: 'cc_type_',
      el_monthSelect: '#monthSelect',
      el_yearSelect: '#yearSelect',

      cardTypes: {
        'American Express': {
          name: 'American Express',
          code: 'ax',
          security: 4,
          pattern: /^3[47]/,
          valid_length: [15],
          formats: {
            length: 15,
            format: 'xxxx xxxxxxx xxxx'
          }
        },
        'Visa': {
          name: 'Visa',
          code: 'vs',
          security: 3,
          pattern: /^4/,
          valid_length: [16],
          formats: {
            length: 16,
            format: 'xxxx xxxx xxxx xxxx'
          }
        },
        'Maestro': {
          name: 'Maestro',
          code: 'ma',
          security: 3,
          pattern: /^(50(18|20|38)|5612|5893|63(04|90)|67(59|6[1-3])|0604)/,
          valid_length: [16],
          formats: {
            length: 16,
            format: 'xxxx xxxx xxxx xxxx'
          }
        },
        'Mastercard': {
          name: 'Mastercard',
          code: 'mc',
          security: 3,
          pattern: /^5[1-5]/,
          valid_length: [16],
          formats: {
            length: 16,
            format: 'xxxx xxxx xxxx xxxx'
          }
        }
      }
    };

    app.addListeners = function () {
      $(app.el_expDate).on('keydown', function (e) {
        app.removeSlash(e);
      });

      $(app.el_expDate).on('keyup', function (e) {
        app.addSlash(e);
      });

      $(app.el_expDate).on('blur', function (e) {
        app.populateDate(e);
      });

      $(app.el_cvv + ', ' + app.el_expDate).on('keypress', function (e) {
        return e.charCode >= 48 && e.charCode <= 57;
      });
    };

    app.addSlash = function (e) {
      var isMonthEntered = app.monthRegex.exec(e.target.value);
      if (e.key >= 0 && e.key <= 9 && isMonthEntered) {
        e.target.value = e.target.value + " / ";
      }
    };

    app.removeSlash = function (e) {
      var isMonthAndSlashEntered = app.monthAndSlashRegex.exec(e.target.value);
      if (isMonthAndSlashEntered && e.key === 'Backspace') {
        e.target.value = e.target.value.slice(0, -3);
      }
    };

    app.populateDate = function (e) {
      var month, year;

      if (e.target.value.length == 7) {
        month = parseInt(e.target.value.slice(0, -5));
        year = "20" + e.target.value.slice(5);

        if (app.checkMonth(month)) {
          $(app.el_monthSelect).val(month);
        } else {
          $(app.el_monthSelect).val(0);
        }

        if (app.checkYear(year)) {
          $(app.el_yearSelect).val(year);
        } else {
          $(app.el_yearSelect).val(0);
        }

      }
    };

    app.checkMonth = function (month) {
      if (month <= 12) {
        var monthSelectOptions = app.getSelectOptions($(app.el_monthSelect));
        month = month.toString();
        if (monthSelectOptions.includes(month)) {
          return true;
        }
      }
    };

    app.checkYear = function (year) {
      var yearSelectOptions = app.getSelectOptions($(app.el_yearSelect));
      if (yearSelectOptions.includes(year)) {
        return true;
      }
    };

    app.getSelectOptions = function (select) {
      var options = select.find('option');
      var optionValues = [];
      for (var i = 0; i < options.length; i++) {
        optionValues[i] = options[i].value;
      }
      return optionValues;
    };

    app.setMaxLength = function ($elem, length) {
      if ($elem.length && app.isInteger(length)) {
        $elem.attr('maxlength', length);
      } else if ($elem.length) {
        $elem.attr('maxlength', '');
      }
    };

    app.isInteger = function (x) {
      return (typeof x === 'number') && (x % 1 === 0);
    };

    app.createExpDateField = function () {
      $(app.el_monthSelect + ', ' + app.el_yearSelect).hide();
      $(app.el_monthSelect).parent().prepend('<input type="text" class="ccFormatMonitor">');
    };


    app.isValidLength = function (cc_num, card_type) {
      for (var i in card_type.valid_length) {
        if (cc_num.length <= card_type.valid_length[i]) {
          return true;
        }
      }
      return false;
    };

    app.getCardType = function (cc_num) {
      for (var i in app.cardTypes) {
        var card_type = app.cardTypes[i];
        if (cc_num.match(card_type.pattern) && app.isValidLength(cc_num, card_type)) {
          return card_type;
        }
      }
    };

    app.getCardFormatString = function (cc_num, card_type) {
      for (var i in card_type.formats) {
        var format = card_type.formats[i];
        if (cc_num.length <= format.length) {
          return format;
        }
      }
    };

    app.formatCardNumber = function (cc_num, card_type) {
      var numAppendedChars = 0;
      var formattedNumber = '';
      var cardFormatIndex = '';

      if (!card_type) {
        return cc_num;
      }

      var cardFormatString = app.getCardFormatString(cc_num, card_type);
      for (var i = 0; i < cc_num.length; i++) {
        cardFormatIndex = i + numAppendedChars;
        if (!cardFormatString || cardFormatIndex >= cardFormatString.length) {
          return cc_num;
        }

        if (cardFormatString.charAt(cardFormatIndex) !== 'x') {
          numAppendedChars++;
          formattedNumber += cardFormatString.charAt(cardFormatIndex) + cc_num.charAt(i);
        } else {
          formattedNumber += cc_num.charAt(i);
        }
      }

      return formattedNumber;
    };

    app.monitorCcFormat = function ($elem) {
      var cc_num = $elem.val().replace(/\D/g, '');
      var card_type = app.getCardType(cc_num);
      $elem.val(app.formatCardNumber(cc_num, card_type));
      app.addCardClassIdentifier($elem, card_type);
    };

    app.addCardClassIdentifier = function ($elem, card_type) {
      var classIdentifier = app.el_ccUnknown;
      if (card_type) {
        classIdentifier = app.el_ccTypePrefix + card_type.code;
        app.setMaxLength($(app.el_cvv), card_type.security);
      } else {
        app.setMaxLength($(app.el_cvv));
      }

      if (!$elem.hasClass(classIdentifier)) {
        var classes = '';
        for (var i in app.cardTypes) {
          classes += app.el_ccTypePrefix + app.cardTypes[i].code + ' ';
        }
        $elem.removeClass(classes + app.el_ccUnknown);
        $elem.addClass(classIdentifier);
      }
    };


    app.init = function () {

      $(document).find(app.el_cardNumber).each(function () {
        var $elem = $(this);
        if ($elem.is('input')) {
          $elem.on('input', function () {
            app.monitorCcFormat($elem);
          });
        }
      });

      app.addListeners();

    }();

  })();

  // popup open
  $('.popup-open').click(function (e) {
    e.preventDefault();

    // console.log();

    $(this).closest('div').find('.popup-wrapper').addClass('opened');
    $('.main-contact').addClass('fixed');
  })

  // popup close
  $('.popup__close').click(function (e) {
    e.preventDefault();

    $('.popup-wrapper').removeClass('opened');
  })

  $('.popup-wrapper').click(function (e) {
    e.preventDefault();

    $('.popup-wrapper').removeClass('opened');
  })


});
