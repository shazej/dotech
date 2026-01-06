import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:dotech_provider/core/error/failures.dart';
import 'package:dotech_provider/core/usecases/usecase.dart';
import '../entities/job.dart';
import '../repositories/jobs_repository.dart';

class UpdateJobStatus implements UseCase<Job, UpdateJobStatusParams> {
  final JobsRepository repository;

  UpdateJobStatus(this.repository);

  @override
  Future<Either<Failure, Job>> call(UpdateJobStatusParams params) async {
    return await repository.updateJobStatus(params.jobId, params.status);
  }
}

class UpdateJobStatusParams extends Equatable {
  final String jobId;
  final String status;

  const UpdateJobStatusParams({required this.jobId, required this.status});

  @override
  List<Object> get props => [jobId, status];
}
