import 'package:dio/dio.dart';
import 'package:dotech_provider/core/error/failures.dart';
import '../models/job_model.dart';

abstract class JobsRemoteDataSource {
  Future<List<JobModel>> getMyJobs();
  Future<JobModel> updateJobStatus(String jobId, String status);
}

class JobsRemoteDataSourceImpl implements JobsRemoteDataSource {
  final Dio dio;

  JobsRemoteDataSourceImpl({required this.dio});

  @override
  Future<List<JobModel>> getMyJobs() async {
    try {
      final response = await dio.get('/provider/jobs');
      return (response.data as List)
          .map((json) => JobModel.fromJson(json))
          .toList();
    } catch (e) {
      throw const ServerFailure(message: 'Failed to fetch jobs');
    }
  }

  @override
  Future<JobModel> updateJobStatus(String jobId, String status) async {
    try {
      final response = await dio.put(
        '/provider/status',
        data: {'id': jobId, 'status': status},
      );
      return JobModel.fromJson(response.data);
    } catch (e) {
      throw const ServerFailure(message: 'Failed to update job status');
    }
  }
}
