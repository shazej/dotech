import 'package:dartz/dartz.dart';
import 'package:dotech_provider/core/error/failures.dart';
import 'package:dotech_provider/features/jobs/domain/entities/job.dart';
import 'package:dotech_provider/features/jobs/domain/repositories/jobs_repository.dart';
import '../datasources/jobs_remote_data_source.dart';

class JobsRepositoryImpl implements JobsRepository {
  final JobsRemoteDataSource remoteDataSource;

  JobsRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, List<Job>>> getMyJobs() async {
    try {
      final jobs = await remoteDataSource.getMyJobs();
      return Right(jobs);
    } catch (e) {
      if (e is Failure) return Left(e);
      return const Left(ServerFailure(message: 'Failed to retrieve jobs'));
    }
  }

  @override
  Future<Either<Failure, Job>> getJobById(String id) async {
    try {
        final job = await remoteDataSource.getJobById(id);
        return Right(job);
    } catch (e) {
        if (e is Failure) return Left(e);
        return const Left(ServerFailure(message: 'Failed to retrieve job details'));
    }
  }

  @override
  Future<Either<Failure, Job>> updateJobStatus(
    String jobId,
    String status,
  ) async {
    try {
      final job = await remoteDataSource.updateJobStatus(jobId, status);
      return Right(job);
    } catch (e) {
      if (e is Failure) return Left(e);
      return const Left(ServerFailure(message: 'Status update failed'));
    }
  }
}
