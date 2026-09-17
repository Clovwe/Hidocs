import 'package:flutter/foundation.dart' show kIsWeb;

class AppConstants {
  static const String appName    = 'HiDocs!';
  static const String appVersion = '1.0.0';

  static const String _port     = '8080';
  static const String _apiPath  = '/api/v1';
  static const String _deviceIp = '10.10.18.156';

  static String get appBaseUrl {
    if (kIsWeb) {
      return 'http://localhost:$_port$_apiPath';
    }
    return 'http://$_deviceIp:$_port$_apiPath';
  }
}
