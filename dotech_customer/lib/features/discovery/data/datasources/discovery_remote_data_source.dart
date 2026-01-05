import 'package:dio/dio.dart';
import 'package:dotech_customer/core/error/failures.dart';
import '../models/service_model.dart';

abstract class DiscoveryRemoteDataSource {
  Future<List<ServiceModel>> getServices(String? categoryId);
}

class DiscoveryRemoteDataSourceImpl implements DiscoveryRemoteDataSource {
  final Dio dio;

  DiscoveryRemoteDataSourceImpl({required this.dio});

  @override
  Future<List<ServiceModel>> getServices(String? categoryId) async {
    try {
      final response = await dio.get(
        '/services',
        queryParameters: categoryId != null ? {'categoryId': categoryId} : null,
      );
      return (response.data as List)
          .map((json) => ServiceModel.fromJson(json))
          .toList();
    } catch (e) {
      throw const ServerFailure(message: 'Failed to fetch services');
    }
  }
}
