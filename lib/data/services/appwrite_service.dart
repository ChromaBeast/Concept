import 'package:appwrite/appwrite.dart';
import '../../core/constants/appwrite_constants.dart';

/// Service managing the Appwrite client and sub-services.
class AppwriteService {
  AppwriteService({
    Client? client,
    Databases? databases,
    Account? account,
    Storage? storage,
    Realtime? realtime,
    String endpoint = AppwriteConstants.endpoint,
    String projectId = AppwriteConstants.projectId,
  }) {
    if (client != null) {
      _client = client;
    } else {
      _client = Client()
        ..setEndpoint(endpoint)
        ..setProject(projectId)
        ..setSelfSigned(status: true);
    }

    _databases = databases ?? Databases(_client);
    _account = account ?? Account(_client);
    _storage = storage ?? Storage(_client);
    _realtime = realtime ?? Realtime(_client);
  }

  late final Client _client;
  late final Databases _databases;
  late final Account _account;
  late final Storage _storage;
  late final Realtime _realtime;

  Client get client => _client;
  Databases get databases => _databases;
  Account get account => _account;
  Storage get storage => _storage;
  Realtime get realtime => _realtime;
}
