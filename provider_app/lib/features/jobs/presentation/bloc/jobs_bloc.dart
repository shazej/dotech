import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:dotech_provider/core/usecases/usecase.dart';
import 'package:dotech_provider/features/jobs/domain/entities/job.dart';
import 'package:dotech_provider/features/jobs/domain/usecases/get_my_jobs.dart';
import 'package:dotech_provider/features/jobs/domain/usecases/update_job_status.dart';
import 'package:dotech_provider/features/jobs/domain/usecases/get_job_by_id.dart';

abstract class JobsEvent extends Equatable {
  const JobsEvent();
  @override
  List<Object?> get props => [];
}

class LoadJobsEvent extends JobsEvent {}

class GetJobDetailEvent extends JobsEvent {
    final String jobId;
    const GetJobDetailEvent(this.jobId);
    @override
    List<Object?> get props => [jobId];
}

class UpdateStatusEvent extends JobsEvent {
  final String jobId;
  final String status;
  const UpdateStatusEvent({required this.jobId, required this.status});
  @override
  List<Object?> get props => [jobId, status];
}

abstract class JobsState extends Equatable {
  const JobsState();
  @override
  List<Object?> get props => [];
}

class JobsInitial extends JobsState {}

class JobsLoading extends JobsState {}

class JobsLoaded extends JobsState {
  final List<Job> jobs;
  const JobsLoaded(this.jobs);
  @override
  List<Object?> get props => [jobs];
}

class JobDetailLoaded extends JobsState {
    final Job job;
    const JobDetailLoaded(this.job);
    @override
    List<Object?> get props => [job];
}

class JobsError extends JobsState {
  final String message;
  const JobsError(this.message);
  @override
  List<Object?> get props => [message];
}

class JobsBloc extends Bloc<JobsEvent, JobsState> {
  final GetMyJobs getMyJobsUseCase;
  final UpdateJobStatus updateJobStatusUseCase;
  final GetJobById? getJobByIdUseCase;

  JobsBloc({
    required this.getMyJobsUseCase,
    required this.updateJobStatusUseCase,
    this.getJobByIdUseCase,
  }) : super(JobsInitial()) {
    on<LoadJobsEvent>((event, emit) async {
      emit(JobsLoading());
      final result = await getMyJobsUseCase(NoParams());
      result.fold(
        (failure) => emit(JobsError(failure.message)),
        (jobs) => emit(JobsLoaded(jobs)),
      );
    });

    on<GetJobDetailEvent>((event, emit) async {
        if (getJobByIdUseCase == null) {
             emit(const JobsError('Feature not configured'));
             return;
        }
        emit(JobsLoading());
        final result = await getJobByIdUseCase!(event.jobId);
        result.fold(
             (failure) => emit(JobsError(failure.message)),
             (job) => emit(JobDetailLoaded(job)),
        );
    });

    on<UpdateStatusEvent>((event, emit) async {
      // Typically we emit loading or stay in current state and update specific job
      final result = await updateJobStatusUseCase(
        UpdateJobStatusParams(jobId: event.jobId, status: event.status),
      );
      result.fold(
        (failure) => emit(JobsError(failure.message)),
        (_) => add(LoadJobsEvent()), // Reload list on success
      );
    });
  }
}
