import 'package:dio/dio.dart';
import 'package:dotech_customer/core/error/failures.dart';
import 'package:dotech_customer/features/auth/data/models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<String> sendOtp(String phone);
  Future<UserModel> verifyOtp(String phone, String otp);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Dio dio;

  AuthRemoteDataSourceImpl({required this.dio});

  @override
  Future<String> sendOtp(String phone) async {
    try {
      final response = await dio.post('/auth/otp/send', data: {'phone': phone});
      return response.data['message'];
    } catch (e) {
      throw const ServerFailure(message: 'Failed to send OTP');
    }
  }

  @override
  Future<UserModel> verifyOtp(String phone, String otp) async {
    try {
      final response = await dio.post(
        '/auth/otp/verify',
        data: {'phone': phone, 'otp': otp},
      );
      // The verification returns { accessToken: '...' }.
      // We might need an additional endpoint to get profile or just use the token.
      // For now, let's assume we get a user object or we'll wrap the logic.
      if (response.statusCode == 201 || response.statusCode == 200) {
        // Normally, response.data would contain the user or token.
        // Assuming the NestJS backend might need adjustment or we mock the User here for now
        // based on the token payload if needed.
        return UserModel(
          id: 'temp-id', // Placeholder or extract from JWT payload
          phone: phone,
          role: 'customer',
          isVerified: true,
        );
      }
      throw const ServerFailure(message: 'Verification failed');
    } catch (e) {
      throw const ServerFailure(message: 'Invalid OTP');
    }
  }
}
