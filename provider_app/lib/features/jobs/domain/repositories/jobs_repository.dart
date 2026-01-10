import 'package:dartz/dartz.dart';
import 'package:dotech_provider/core/error/failures.dart';
import '../entities/job.dart';

abstract class JobsRepository {
  Future<Either<Failure, List<Job>>> getMyJobs();
  Future<Either<Failure, Job>> getJobById(String id);
  Future<Either<Failure, Job>> updateJobStatus(String jobId, String status);
}
