import 'package:dio/dio.dart';
import 'package:dotech_provider/core/error/failures.dart';
import '../models/provider_profile_model.dart';

abstract class OnboardingRemoteDataSource {
  Future<ProviderProfileModel> updateProfile({
    required String bio,
    required List<String> skills,
  });
  Future<ProviderProfileModel> getProfile();
}

class OnboardingRemoteDataSourceImpl implements OnboardingRemoteDataSource {
  final Dio dio;

  OnboardingRemoteDataSourceImpl({required this.dio});

  @override
  Future<ProviderProfileModel> updateProfile({
    required String bio,
    required List<String> skills,
  }) async {
    try {
      final response = await dio.put(
        '/provider/profile',
        data: {'bio': bio, 'skills': skills},
      );
      return ProviderProfileModel.fromJson(response.data);
    } catch (e) {
      throw const ServerFailure(message: 'Failed to update profile');
    }
  }

  @override
  Future<ProviderProfileModel> getProfile() async {
    try {
      final response = await dio.get('/provider/profile');
      return ProviderProfileModel.fromJson(response.data);
    } catch (e) {
      throw const ServerFailure(message: 'Failed to fetch provider profile');
    }
  }
}
